export interface WorkoutSet {
  reps: number;
  weightKg?: number;
}

export interface WorkoutExerciseEntry {
  exerciseId?: string;
  exerciseComboId?: string;
  orderIndex: number;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  time: string;
  durationMinutes?: number;
  locationId: string | null;
  exercises: WorkoutExerciseEntry[];
}
