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
  {
    id: '4',
    userId: '2',
    date: '2026-03-30',
    time: '07:00',
    durationMinutes: 40,
    locationId: null,
    exercises: [
      {
        exerciseId: '29',
        orderIndex: 0,
        sets: [],
        segments: [
          { durationMinutes: 5, speedKmh: 6, heartRateBpm: 100, caloriesBurned: 40 },
          { durationMinutes: 20, speedKmh: 8, heartRateBpm: 140, caloriesBurned: 200 },
          { durationMinutes: 10, speedKmh: 10, heartRateBpm: 160, caloriesBurned: 150 },
          { durationMinutes: 5, speedKmh: 6, heartRateBpm: 110, caloriesBurned: 40 },
        ],
      },
    ],
  },
  // User hemm (id: 31) - Körperschmiede Schweinfurt (id: 11) - Februar
  {
    id: '17',
    userId: '31',
    date: '2026-02-02',
    time: '09:00',
    durationMinutes: 60,
    locationId: '11',
    description: 'Oberkörper Push',
    exercises: [
      { exerciseId: '1', orderIndex: 0, sets: [{ reps: 12, weightKg: 45 }, { reps: 10, weightKg: 50 }, { reps: 8, weightKg: 55 }] },
      { exerciseId: '8', orderIndex: 1, sets: [{ reps: 12, weightKg: 17.5 }, { reps: 10, weightKg: 20 }, { reps: 8, weightKg: 22.5 }] },
      { exerciseId: '13', orderIndex: 2, sets: [{ reps: 10 }, { reps: 8 }, { reps: 6 }] },
    ],
  },
  {
    id: '18',
    userId: '31',
    date: '2026-02-04',
    time: '07:00',
    durationMinutes: 30,
    locationId: null,
    description: 'Lockerer Lauf',
    exercises: [
      { exerciseId: '29', orderIndex: 0, sets: [], segments: [
        { durationMinutes: 5, speedKmh: 5.5, heartRateBpm: 105 },
        { durationMinutes: 20, speedKmh: 7.5, heartRateBpm: 135, caloriesBurned: 210 },
        { durationMinutes: 5, speedKmh: 5, heartRateBpm: 100 },
      ] },
    ],
  },
  {
    id: '19',
    userId: '31',
    date: '2026-02-06',
    time: '18:00',
    durationMinutes: 65,
    locationId: '11',
    description: 'Beine & Rücken',
    exercises: [
      { exerciseId: '15', orderIndex: 0, sets: [{ reps: 10, weightKg: 55 }, { reps: 8, weightKg: 60 }, { reps: 8, weightKg: 65 }, { reps: 6, weightKg: 70 }] },
      { exerciseId: '7', orderIndex: 1, sets: [{ reps: 8, weightKg: 70 }, { reps: 6, weightKg: 80 }, { reps: 5, weightKg: 85 }] },
      { exerciseId: '19', orderIndex: 2, sets: [{ reps: 15 }, { reps: 15 }, { reps: 12 }] },
    ],
  },
  {
    id: '20',
    userId: '31',
    date: '2026-02-09',
    time: '10:00',
    durationMinutes: 70,
    locationId: '11',
    description: 'Oberkörper Pull',
    exercises: [
      { exerciseId: '4', orderIndex: 0, sets: [{ reps: 8 }, { reps: 6 }, { reps: 5 }] },
      { exerciseId: '6', orderIndex: 1, sets: [{ reps: 10, weightKg: 45 }, { reps: 8, weightKg: 50 }, { reps: 8, weightKg: 55 }] },
      { exerciseId: '11', orderIndex: 2, sets: [{ reps: 12, weightKg: 10 }, { reps: 10, weightKg: 12 }, { reps: 10, weightKg: 12 }] },
      { exerciseId: '25', orderIndex: 3, sets: [{ reps: 15, weightKg: 12.5 }, { reps: 12, weightKg: 15 }, { reps: 12, weightKg: 15 }] },
    ],
  },
  {
    id: '21',
    userId: '31',
    date: '2026-02-11',
    time: '06:30',
    durationMinutes: 35,
    locationId: '11',
    description: 'Intervall-Lauf',
    exercises: [
      { exerciseId: '29', orderIndex: 0, sets: [], segments: [
        { durationMinutes: 5, speedKmh: 6, heartRateBpm: 108 },
        { durationMinutes: 8, speedKmh: 9, heartRateBpm: 150, caloriesBurned: 100 },
        { durationMinutes: 3, speedKmh: 6, heartRateBpm: 120 },
        { durationMinutes: 8, speedKmh: 9.5, heartRateBpm: 155, caloriesBurned: 105 },
        { durationMinutes: 3, speedKmh: 6, heartRateBpm: 118 },
        { durationMinutes: 5, speedKmh: 10, heartRateBpm: 162, caloriesBurned: 75 },
        { durationMinutes: 3, speedKmh: 5, heartRateBpm: 100 },
      ] },
    ],
  },
  {
    id: '22',
    userId: '31',
    date: '2026-02-13',
    time: '18:30',
    durationMinutes: 65,
    locationId: '11',
    description: 'Ganzkörper',
    exercises: [
      { exerciseId: '1', orderIndex: 0, sets: [{ reps: 10, weightKg: 50 }, { reps: 8, weightKg: 55 }, { reps: 8, weightKg: 60 }] },
      { exerciseId: '15', orderIndex: 1, sets: [{ reps: 10, weightKg: 60 }, { reps: 8, weightKg: 65 }, { reps: 6, weightKg: 70 }] },
      { exerciseId: '5', orderIndex: 2, sets: [{ reps: 12, weightKg: 40 }, { reps: 10, weightKg: 45 }, { reps: 8, weightKg: 50 }] },
      { exerciseId: '21', orderIndex: 3, sets: [{ reps: 45 }, { reps: 40 }, { reps: 35 }] },
    ],
  },
  {
    id: '23',
    userId: '31',
    date: '2026-02-16',
    time: '09:00',
    durationMinutes: 40,
    locationId: null,
    description: 'Langer Lauf',
    exercises: [
      { exerciseId: '29', orderIndex: 0, sets: [], segments: [
        { durationMinutes: 5, speedKmh: 6, heartRateBpm: 105 },
        { durationMinutes: 30, speedKmh: 8, heartRateBpm: 142, caloriesBurned: 320 },
        { durationMinutes: 5, speedKmh: 5, heartRateBpm: 102 },
      ] },
    ],
  },
  {
    id: '24',
    userId: '31',
    date: '2026-02-18',
    time: '18:00',
    durationMinutes: 70,
    locationId: '11',
    description: 'Oberkörper Push',
    exercises: [
      { exerciseId: '2', orderIndex: 0, sets: [{ reps: 10, weightKg: 40 }, { reps: 8, weightKg: 45 }, { reps: 8, weightKg: 50 }] },
      { exerciseId: '9', orderIndex: 1, sets: [{ reps: 12, weightKg: 8 }, { reps: 10, weightKg: 10 }, { reps: 10, weightKg: 10 }] },
      { exerciseId: '14', orderIndex: 2, sets: [{ reps: 12, weightKg: 20 }, { reps: 10, weightKg: 25 }, { reps: 10, weightKg: 25 }] },
      { exerciseId: '20', orderIndex: 3, sets: [{ reps: 20 }, { reps: 20 }, { reps: 15 }] },
    ],
  },
  {
    id: '25',
    userId: '31',
    date: '2026-02-21',
    time: '10:00',
    durationMinutes: 60,
    locationId: '11',
    description: 'Beine intensiv',
    exercises: [
      { exerciseId: '15', orderIndex: 0, sets: [{ reps: 10, weightKg: 60 }, { reps: 8, weightKg: 70 }, { reps: 6, weightKg: 75 }, { reps: 6, weightKg: 80 }] },
      { exerciseId: '23', orderIndex: 1, sets: [{ reps: 12, weightKg: 45 }, { reps: 10, weightKg: 50 }, { reps: 10, weightKg: 55 }] },
      { exerciseId: '24', orderIndex: 2, sets: [{ reps: 12, weightKg: 14 }, { reps: 12, weightKg: 14 }, { reps: 10, weightKg: 16 }] },
    ],
  },
  {
    id: '26',
    userId: '31',
    date: '2026-02-24',
    time: '07:00',
    durationMinutes: 35,
    locationId: null,
    description: 'Tempolauf',
    exercises: [
      { exerciseId: '29', orderIndex: 0, sets: [], segments: [
        { durationMinutes: 5, speedKmh: 6, heartRateBpm: 108 },
        { durationMinutes: 20, speedKmh: 9, heartRateBpm: 148, caloriesBurned: 240 },
        { durationMinutes: 5, speedKmh: 10.5, heartRateBpm: 165, caloriesBurned: 80 },
        { durationMinutes: 5, speedKmh: 5, heartRateBpm: 105 },
      ] },
    ],
  },
  {
    id: '27',
    userId: '31',
    date: '2026-02-26',
    time: '18:30',
    durationMinutes: 65,
    locationId: '11',
    description: 'Oberkörper Pull',
    exercises: [
      { exerciseId: '4', orderIndex: 0, sets: [{ reps: 8 }, { reps: 7 }, { reps: 6 }] },
      { exerciseId: '6', orderIndex: 1, sets: [{ reps: 10, weightKg: 50 }, { reps: 8, weightKg: 55 }, { reps: 8, weightKg: 57.5 }] },
      { exerciseId: '26', orderIndex: 2, sets: [{ reps: 12, weightKg: 20 }, { reps: 10, weightKg: 22.5 }, { reps: 10, weightKg: 25 }] },
      { exerciseId: '22', orderIndex: 3, sets: [{ reps: 20, weightKg: 5 }, { reps: 15, weightKg: 5 }, { reps: 15, weightKg: 8 }] },
    ],
  },
  // User hemm (id: 31) - Körperschmiede Schweinfurt (id: 11) - März
  {
    id: '5',
    userId: '31',
    date: '2026-03-03',
    time: '07:00',
    durationMinutes: 35,
    locationId: '11',
    exercises: [
      {
        exerciseId: '29',
        orderIndex: 0,
        sets: [],
        segments: [
          { durationMinutes: 5, speedKmh: 6, heartRateBpm: 110 },
          { durationMinutes: 25, speedKmh: 8.5, heartRateBpm: 145, caloriesBurned: 280 },
          { durationMinutes: 5, speedKmh: 5, heartRateBpm: 105 },
        ],
      },
    ],
  },
  {
    id: '6',
    userId: '31',
    date: '2026-03-05',
    time: '18:00',
    durationMinutes: 70,
    locationId: '11',
    exercises: [
      {
        exerciseId: '1',
        orderIndex: 0,
        sets: [
          { reps: 12, weightKg: 50 },
          { reps: 10, weightKg: 60 },
          { reps: 8, weightKg: 65 },
          { reps: 6, weightKg: 70 },
        ],
      },
      {
        exerciseId: '5',
        orderIndex: 1,
        sets: [
          { reps: 12, weightKg: 45 },
          { reps: 10, weightKg: 50 },
          { reps: 8, weightKg: 55 },
        ],
      },
      {
        exerciseId: '8',
        orderIndex: 2,
        sets: [
          { reps: 12, weightKg: 20 },
          { reps: 10, weightKg: 25 },
          { reps: 8, weightKg: 25 },
        ],
      },
      {
        exerciseId: '20',
        orderIndex: 3,
        sets: [
          { reps: 20 },
          { reps: 20 },
          { reps: 15 },
        ],
      },
    ],
  },
  {
    id: '7',
    userId: '31',
    date: '2026-03-08',
    time: '09:00',
    durationMinutes: 45,
    locationId: null,
    exercises: [
      {
        exerciseId: '29',
        orderIndex: 0,
        sets: [],
        segments: [
          { durationMinutes: 5, speedKmh: 6, heartRateBpm: 105 },
          { durationMinutes: 30, speedKmh: 9, heartRateBpm: 150, caloriesBurned: 350 },
          { durationMinutes: 10, speedKmh: 6, heartRateBpm: 110 },
        ],
      },
    ],
  },
  {
    id: '8',
    userId: '31',
    date: '2026-03-10',
    time: '18:30',
    durationMinutes: 65,
    locationId: '11',
    exercises: [
      {
        exerciseId: '15',
        orderIndex: 0,
        sets: [
          { reps: 10, weightKg: 60 },
          { reps: 8, weightKg: 70 },
          { reps: 8, weightKg: 80 },
          { reps: 6, weightKg: 85 },
        ],
      },
      {
        exerciseId: '7',
        orderIndex: 1,
        sets: [
          { reps: 8, weightKg: 80 },
          { reps: 6, weightKg: 90 },
          { reps: 5, weightKg: 100 },
        ],
      },
      {
        exerciseId: '23',
        orderIndex: 2,
        sets: [
          { reps: 12, weightKg: 50 },
          { reps: 10, weightKg: 60 },
          { reps: 10, weightKg: 60 },
        ],
      },
    ],
  },
  {
    id: '9',
    userId: '31',
    date: '2026-03-13',
    time: '06:30',
    durationMinutes: 40,
    locationId: '11',
    exercises: [
      {
        exerciseId: '29',
        orderIndex: 0,
        sets: [],
        segments: [
          { durationMinutes: 5, speedKmh: 6, heartRateBpm: 108 },
          { durationMinutes: 10, speedKmh: 8, heartRateBpm: 140, caloriesBurned: 110 },
          { durationMinutes: 15, speedKmh: 10, heartRateBpm: 160, caloriesBurned: 200 },
          { durationMinutes: 5, speedKmh: 8, heartRateBpm: 145, caloriesBurned: 60 },
          { durationMinutes: 5, speedKmh: 5, heartRateBpm: 100 },
        ],
      },
    ],
  },
  {
    id: '10',
    userId: '31',
    date: '2026-03-15',
    time: '10:00',
    durationMinutes: 75,
    locationId: '11',
    exercises: [
      {
        exerciseId: '1',
        orderIndex: 0,
        sets: [
          { reps: 12, weightKg: 55 },
          { reps: 10, weightKg: 60 },
          { reps: 8, weightKg: 70 },
          { reps: 6, weightKg: 75 },
        ],
      },
      {
        exerciseId: '3',
        orderIndex: 1,
        sets: [
          { reps: 12, weightKg: 40 },
          { reps: 10, weightKg: 45 },
          { reps: 10, weightKg: 45 },
        ],
      },
      {
        exerciseId: '13',
        orderIndex: 2,
        sets: [
          { reps: 10 },
          { reps: 8 },
          { reps: 6 },
        ],
      },
      {
        exerciseId: '11',
        orderIndex: 3,
        sets: [
          { reps: 12, weightKg: 12 },
          { reps: 10, weightKg: 14 },
          { reps: 10, weightKg: 14 },
        ],
      },
    ],
  },
  {
    id: '11',
    userId: '31',
    date: '2026-03-18',
    time: '18:00',
    durationMinutes: 60,
    locationId: '11',
    exercises: [
      {
        exerciseId: '15',
        orderIndex: 0,
        sets: [
          { reps: 10, weightKg: 65 },
          { reps: 8, weightKg: 75 },
          { reps: 8, weightKg: 80 },
          { reps: 6, weightKg: 90 },
        ],
      },
      {
        exerciseId: '24',
        orderIndex: 1,
        sets: [
          { reps: 12, weightKg: 16 },
          { reps: 12, weightKg: 16 },
          { reps: 10, weightKg: 20 },
        ],
      },
      {
        exerciseId: '19',
        orderIndex: 2,
        sets: [
          { reps: 15 },
          { reps: 15 },
          { reps: 12 },
        ],
      },
    ],
  },
  {
    id: '12',
    userId: '31',
    date: '2026-03-20',
    time: '07:00',
    durationMinutes: 40,
    locationId: null,
    exercises: [
      {
        exerciseId: '29',
        orderIndex: 0,
        sets: [],
        segments: [
          { durationMinutes: 5, speedKmh: 6.5, heartRateBpm: 108 },
          { durationMinutes: 30, speedKmh: 9.5, heartRateBpm: 152, caloriesBurned: 370 },
          { durationMinutes: 5, speedKmh: 5, heartRateBpm: 100 },
        ],
      },
    ],
  },
  {
    id: '13',
    userId: '31',
    date: '2026-03-22',
    time: '17:30',
    durationMinutes: 70,
    locationId: '11',
    exercises: [
      {
        exerciseId: '6',
        orderIndex: 0,
        sets: [
          { reps: 10, weightKg: 50 },
          { reps: 8, weightKg: 55 },
          { reps: 8, weightKg: 60 },
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
      {
        exerciseId: '25',
        orderIndex: 2,
        sets: [
          { reps: 15, weightKg: 15 },
          { reps: 12, weightKg: 17.5 },
          { reps: 12, weightKg: 17.5 },
        ],
      },
      {
        exerciseId: '21',
        orderIndex: 3,
        sets: [
          { reps: 45 },
          { reps: 40 },
          { reps: 35 },
        ],
      },
    ],
  },
  {
    id: '14',
    userId: '31',
    date: '2026-03-25',
    time: '18:00',
    durationMinutes: 65,
    locationId: '11',
    exercises: [
      {
        exerciseId: '1',
        orderIndex: 0,
        sets: [
          { reps: 10, weightKg: 60 },
          { reps: 8, weightKg: 65 },
          { reps: 6, weightKg: 72.5 },
          { reps: 6, weightKg: 75 },
        ],
      },
      {
        exerciseId: '8',
        orderIndex: 1,
        sets: [
          { reps: 10, weightKg: 25 },
          { reps: 8, weightKg: 27.5 },
          { reps: 8, weightKg: 30 },
        ],
      },
      {
        exerciseId: '14',
        orderIndex: 2,
        sets: [
          { reps: 12, weightKg: 25 },
          { reps: 10, weightKg: 30 },
          { reps: 10, weightKg: 30 },
        ],
      },
    ],
  },
  {
    id: '15',
    userId: '31',
    date: '2026-03-27',
    time: '06:30',
    durationMinutes: 45,
    locationId: null,
    exercises: [
      {
        exerciseId: '29',
        orderIndex: 0,
        sets: [],
        segments: [
          { durationMinutes: 5, speedKmh: 6.5, heartRateBpm: 105 },
          { durationMinutes: 15, speedKmh: 9, heartRateBpm: 148, caloriesBurned: 170 },
          { durationMinutes: 15, speedKmh: 10.5, heartRateBpm: 162, caloriesBurned: 210 },
          { durationMinutes: 5, speedKmh: 10, heartRateBpm: 158, caloriesBurned: 70 },
          { durationMinutes: 5, speedKmh: 5, heartRateBpm: 100 },
        ],
      },
    ],
  },
  {
    id: '16',
    userId: '31',
    date: '2026-03-29',
    time: '10:00',
    durationMinutes: 75,
    locationId: '11',
    exercises: [
      {
        exerciseId: '15',
        orderIndex: 0,
        sets: [
          { reps: 10, weightKg: 70 },
          { reps: 8, weightKg: 80 },
          { reps: 6, weightKg: 85 },
          { reps: 6, weightKg: 90 },
        ],
      },
      {
        exerciseId: '7',
        orderIndex: 1,
        sets: [
          { reps: 6, weightKg: 90 },
          { reps: 5, weightKg: 100 },
          { reps: 4, weightKg: 105 },
        ],
      },
      {
        exerciseId: '23',
        orderIndex: 2,
        sets: [
          { reps: 12, weightKg: 55 },
          { reps: 10, weightKg: 65 },
          { reps: 10, weightKg: 65 },
        ],
      },
      {
        exerciseId: '20',
        orderIndex: 3,
        sets: [
          { reps: 25 },
          { reps: 20 },
          { reps: 20 },
        ],
      },
    ],
  },
];
