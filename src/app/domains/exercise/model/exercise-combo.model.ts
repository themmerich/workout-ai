export type ComboType = 'amrap';
// Extensible: | 'emom' | 'tabata' | 'for-time'

export const COMBO_TYPES: ComboType[] = ['amrap'];

export interface ComboExercise {
  exerciseId: string;
  reps: number;
  weightKg?: number;
  orderIndex: number;
}

export interface ExerciseCombo {
  id: string;
  name: string;
  type: ComboType;
  timeLimitMinutes?: number;
  exercises: ComboExercise[];
  description?: string;
}
