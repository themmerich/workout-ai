import { computed, inject, Injectable } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { WorkoutService } from './workout.service';
import { buildMedalCatalog, EarnedMedal } from '../model/medal.model';

@Injectable({ providedIn: 'root' })
export class MedalService {
  private readonly authService = inject(AuthService);
  private readonly workoutService = inject(WorkoutService);
  private readonly exerciseService = inject(ExerciseService);

  readonly medals = computed<EarnedMedal[]>(() => {
    const user = this.authService.currentUser();
    if (!user) return [];

    const workouts = this.workoutService.getByUserId(user.id);
    const exercises = this.exerciseService.exercises();
    const catalog = buildMedalCatalog(exercises, workouts);
    const context = { workouts, exercises };

    return catalog
      .map((definition) => ({
        definition,
        result: definition.compute(context),
      }))
      .sort((a, b) => {
        if (a.result.earned !== b.result.earned) return a.result.earned ? -1 : 1;
        return 0;
      });
  });

  readonly earnedCount = computed(() => this.medals().filter((m) => m.result.earned).length);

  readonly totalCount = computed(() => this.medals().length);
}
