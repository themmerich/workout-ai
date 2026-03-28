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

export interface Exercise {
  id: string;
  name: string;
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
