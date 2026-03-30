import { Workout } from '../model/workout.model';

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    userId: '2',
    date: '2026-03-28',
    time: '08:00',
    durationMinutes: 60,
    locationId: '1',
    exercises: [
      {
        exerciseId: '1',
        orderIndex: 0,
        sets: [
          { reps: 12, weightKg: 60 },
          { reps: 10, weightKg: 70 },
          { reps: 8, weightKg: 80 },
        ],
      },
      {
        exerciseId: '15',
        orderIndex: 1,
        sets: [
          { reps: 10, weightKg: 60 },
          { reps: 10, weightKg: 70 },
          { reps: 8, weightKg: 80 },
        ],
      },
      {
        exerciseId: '20',
        orderIndex: 2,
        sets: [
          { reps: 20 },
          { reps: 20 },
          { reps: 15 },
        ],
      },
    ],
  },
  {
    id: '2',
    userId: '2',
    date: '2026-03-29',
    time: '17:30',
    durationMinutes: 45,
    locationId: null,
    exercises: [
      {
        exerciseComboId: '1',
        orderIndex: 0,
        sets: [
          { reps: 5 },
          { reps: 4 },
          { reps: 3 },
        ],
      },
    ],
  },
  {
    id: '3',
    userId: '3',
    date: '2026-03-30',
    time: '10:00',
    durationMinutes: 75,
    locationId: '1',
    exercises: [
      {
        exerciseId: '7',
        orderIndex: 0,
        sets: [
          { reps: 5, weightKg: 100 },
          { reps: 5, weightKg: 110 },
          { reps: 3, weightKg: 120 },
        ],
      },
      {
        exerciseId: '4',
        orderIndex: 1,
        sets: [
          { reps: 8 },
          { reps: 6 },
          { reps: 5 },
        ],
      },
    ],
  },
];
