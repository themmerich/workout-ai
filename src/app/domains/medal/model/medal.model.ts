import { Exercise } from '../../exercise/model/exercise.model';
import { Workout } from '../../workout/model/workout.model';
import { MUSCLE_GROUPS } from '../../exercise/model/exercise.model';

export type MedalCategory = 'strength' | 'cardio' | 'general';

export interface MedalDefinition {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: MedalCategory;
  icon: string;
  compute: (ctx: MedalComputeContext) => MedalResult;
}

export interface MedalResult {
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  detail?: string;
}

export interface MedalComputeContext {
  workouts: Workout[];
  exercises: Exercise[];
}

export interface EarnedMedal {
  definition: MedalDefinition;
  result: MedalResult;
}

function findEarliestDate(workouts: Workout[], predicate: (w: Workout) => boolean): string | undefined {
  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));
  return sorted.find(predicate)?.date;
}

function computeStreak(workouts: Workout[]): number {
  const dates = [...new Set(workouts.map((w) => w.date))].sort();
  if (dates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  return maxStreak;
}

export function buildMedalCatalog(exercises: Exercise[], userWorkouts: Workout[]): MedalDefinition[] {
  const catalog: MedalDefinition[] = [];

  // --- General ---
  catalog.push({
    id: 'first-workout',
    nameKey: 'medal.general.firstWorkout',
    descriptionKey: 'medal.general.firstWorkoutDesc',
    category: 'general',
    icon: 'pi-star',
    compute: (ctx) => ({
      earned: ctx.workouts.length >= 1,
      earnedDate: findEarliestDate(ctx.workouts, () => true),
      progress: Math.min(ctx.workouts.length, 1),
    }),
  });

  for (const milestone of [10, 25, 50, 100]) {
    catalog.push({
      id: `workouts-${milestone}`,
      nameKey: `medal.general.workouts${milestone}`,
      descriptionKey: `medal.general.workouts${milestone}Desc`,
      category: 'general',
      icon: 'pi-star-fill',
      compute: (ctx) => {
        const sorted = [...ctx.workouts].sort((a, b) => a.date.localeCompare(b.date));
        return {
          earned: ctx.workouts.length >= milestone,
          earnedDate: sorted.length >= milestone ? sorted[milestone - 1].date : undefined,
          progress: Math.min(ctx.workouts.length / milestone, 1),
          detail: `${ctx.workouts.length}/${milestone}`,
        };
      },
    });
  }

  catalog.push({
    id: 'all-muscle-groups',
    nameKey: 'medal.general.allMuscleGroups',
    descriptionKey: 'medal.general.allMuscleGroupsDesc',
    category: 'general',
    icon: 'pi-objects-column',
    compute: (ctx) => {
      const trainedGroups = new Set<string>();
      for (const w of ctx.workouts) {
        for (const entry of w.exercises) {
          if (entry.exerciseId) {
            const ex = ctx.exercises.find((e) => e.id === entry.exerciseId);
            ex?.muscleGroups.forEach((mg) => trainedGroups.add(mg));
          }
        }
      }
      const total = MUSCLE_GROUPS.length;
      return {
        earned: trainedGroups.size >= total,
        progress: trainedGroups.size / total,
        detail: `${trainedGroups.size}/${total}`,
      };
    },
  });

  // --- Strength: 100kg Club ---
  catalog.push({
    id: 'first-100kg',
    nameKey: 'medal.strength.first100kg',
    descriptionKey: 'medal.strength.first100kgDesc',
    category: 'strength',
    icon: 'pi-trophy',
    compute: (ctx) => {
      for (const w of [...ctx.workouts].sort((a, b) => a.date.localeCompare(b.date))) {
        for (const entry of w.exercises) {
          for (const set of entry.sets) {
            if (set.weightKg && set.weightKg >= 100) {
              return { earned: true, earnedDate: w.date, detail: `${set.weightKg} kg` };
            }
          }
        }
      }
      return { earned: false };
    },
  });

  // --- Strength: Dynamic PR per exercise ---
  const usedExerciseIds = new Set<string>();
  for (const w of userWorkouts) {
    for (const entry of w.exercises) {
      if (entry.exerciseId && entry.sets.some((s) => s.weightKg)) {
        usedExerciseIds.add(entry.exerciseId);
      }
    }
  }

  for (const exerciseId of usedExerciseIds) {
    const exercise = exercises.find((e) => e.id === exerciseId);
    if (!exercise || exercise.type !== 'strength') continue;

    catalog.push({
      id: `pr-${exerciseId}`,
      nameKey: 'medal.strength.prPrefix',
      descriptionKey: 'medal.strength.prDesc',
      category: 'strength',
      icon: 'pi-bolt',
      compute: (ctx) => {
        let maxWeight = 0;
        let prDate: string | undefined;
        for (const w of [...ctx.workouts].sort((a, b) => a.date.localeCompare(b.date))) {
          for (const entry of w.exercises) {
            if (entry.exerciseId === exerciseId) {
              for (const set of entry.sets) {
                if (set.weightKg && set.weightKg > maxWeight) {
                  maxWeight = set.weightKg;
                  prDate = w.date;
                }
              }
            }
          }
        }
        return {
          earned: maxWeight > 0,
          earnedDate: prDate,
          detail: maxWeight > 0 ? `${maxWeight} kg` : undefined,
        };
      },
    });
  }

  // --- Cardio ---
  catalog.push({
    id: 'longest-run',
    nameKey: 'medal.cardio.longestRun',
    descriptionKey: 'medal.cardio.longestRunDesc',
    category: 'cardio',
    icon: 'pi-clock',
    compute: (ctx) => {
      let maxDuration = 0;
      let bestDate: string | undefined;
      for (const w of ctx.workouts) {
        for (const entry of w.exercises) {
          if (entry.segments?.length) {
            const total = entry.segments.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
            if (total > maxDuration) {
              maxDuration = total;
              bestDate = w.date;
            }
          }
        }
      }
      return {
        earned: maxDuration > 0,
        earnedDate: bestDate,
        detail: maxDuration > 0 ? `${maxDuration} min` : undefined,
      };
    },
  });

  catalog.push({
    id: 'fastest-speed',
    nameKey: 'medal.cardio.fastestSpeed',
    descriptionKey: 'medal.cardio.fastestSpeedDesc',
    category: 'cardio',
    icon: 'pi-forward',
    compute: (ctx) => {
      let maxSpeed = 0;
      let bestDate: string | undefined;
      for (const w of ctx.workouts) {
        for (const entry of w.exercises) {
          for (const seg of entry.segments ?? []) {
            if (seg.speedKmh && seg.speedKmh > maxSpeed) {
              maxSpeed = seg.speedKmh;
              bestDate = w.date;
            }
          }
        }
      }
      return {
        earned: maxSpeed > 0,
        earnedDate: bestDate,
        detail: maxSpeed > 0 ? `${maxSpeed} km/h` : undefined,
      };
    },
  });

  catalog.push({
    id: 'most-calories',
    nameKey: 'medal.cardio.mostCalories',
    descriptionKey: 'medal.cardio.mostCaloriesDesc',
    category: 'cardio',
    icon: 'pi-sun',
    compute: (ctx) => {
      let maxCal = 0;
      let bestDate: string | undefined;
      for (const w of ctx.workouts) {
        for (const entry of w.exercises) {
          if (entry.segments?.length) {
            const total = entry.segments.reduce((sum, s) => sum + (s.caloriesBurned ?? 0), 0);
            if (total > maxCal) {
              maxCal = total;
              bestDate = w.date;
            }
          }
        }
      }
      return {
        earned: maxCal > 0,
        earnedDate: bestDate,
        detail: maxCal > 0 ? `${maxCal} kcal` : undefined,
      };
    },
  });

  // --- Streaks ---
  for (const days of [3, 7, 14, 30]) {
    catalog.push({
      id: `streak-${days}`,
      nameKey: `medal.streak.streak${days}`,
      descriptionKey: `medal.streak.streak${days}Desc`,
      category: 'general',
      icon: 'pi-calendar',
      compute: (ctx) => {
        const streak = computeStreak(ctx.workouts);
        return {
          earned: streak >= days,
          progress: Math.min(streak / days, 1),
          detail: `${streak}/${days}`,
        };
      },
    });
  }

  return catalog;
}
