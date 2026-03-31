export interface WorkoutSet {
  reps: number;
  weightKg?: number;
}

export interface CardioSegment {
  durationMinutes?: number;
  speedKmh?: number;
  heartRateBpm?: number;
  caloriesBurned?: number;
}

export interface WorkoutExerciseEntry {
  exerciseId?: string;
  exerciseComboId?: string;
  orderIndex: number;
  sets: WorkoutSet[];
  segments?: CardioSegment[];
}

export interface Workout {
  id: string;
  userId: string;
  date: string;
  time: string;
  durationMinutes?: number;
  locationId: string | null;
  description?: string;
  exercises: WorkoutExerciseEntry[];
}
