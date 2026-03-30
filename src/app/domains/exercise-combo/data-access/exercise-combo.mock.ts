import { ExerciseCombo } from '../model/exercise-combo.model';

export const MOCK_EXERCISE_COMBOS: ExerciseCombo[] = [
  {
    id: '1',
    name: 'Bodyweight Blast',
    type: 'amrap',
    timeLimitMinutes: 20,
    description: 'So viele Runden wie möglich in 20 Minuten',
    exercises: [
      { exerciseId: '15', reps: 20, orderIndex: 0 },
      { exerciseId: '20', reps: 15, orderIndex: 1 },
      { exerciseId: '24', reps: 10, orderIndex: 2 },
    ],
  },
  {
    id: '2',
    name: 'Upper Body Burner',
    type: 'amrap',
    timeLimitMinutes: 15,
    description: 'So viele Runden wie möglich in 15 Minuten',
    exercises: [
      { exerciseId: '4', reps: 5, orderIndex: 0 },
      { exerciseId: '8', reps: 10, weightKg: 20, orderIndex: 1 },
      { exerciseId: '13', reps: 15, orderIndex: 2 },
    ],
  },
  {
    id: '3',
    name: 'Core Crusher',
    type: 'amrap',
    timeLimitMinutes: 12,
    description: 'So viele Runden wie möglich in 12 Minuten',
    exercises: [
      { exerciseId: '20', reps: 20, orderIndex: 0 },
      { exerciseId: '21', reps: 30, orderIndex: 1 },
      { exerciseId: '22', reps: 15, weightKg: 5, orderIndex: 2 },
    ],
  },
  {
    id: '4',
    name: 'Leg Day AMRAP',
    type: 'amrap',
    timeLimitMinutes: 18,
    description: 'So viele Runden wie möglich in 18 Minuten',
    exercises: [
      { exerciseId: '15', reps: 10, weightKg: 40, orderIndex: 0 },
      { exerciseId: '24', reps: 12, weightKg: 10, orderIndex: 1 },
      { exerciseId: '23', reps: 8, weightKg: 30, orderIndex: 2 },
      { exerciseId: '19', reps: 15, orderIndex: 3 },
    ],
  },
];
