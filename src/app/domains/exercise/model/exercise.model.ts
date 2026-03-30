export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'glutes'
  | 'quadriceps'
  | 'hamstrings'
  | 'calves'
  | 'hip-flexors'
  | 'traps'
  | 'lats';

export type ExerciseType = 'strength' | 'cardio';

export const EXERCISE_TYPES: ExerciseType[] = ['strength', 'cardio'];

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  muscleGroups: MuscleGroup[];
  equipmentIds: string[];
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'forearms',
  'abs',
  'glutes',
  'quadriceps',
  'hamstrings',
  'calves',
  'hip-flexors',
  'traps',
  'lats',
];
