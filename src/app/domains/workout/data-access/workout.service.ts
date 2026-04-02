import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { Workout } from '../model/workout.model';
import { MOCK_WORKOUTS } from './workout.mock';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  // TODO: Replace mock data with HTTP REST API calls
  readonly workouts = signal<Workout[]>(MOCK_WORKOUTS);

  getByUserId(userId: string): Workout[] {
    return this.workouts().filter((w) => w.userId === userId);
  }

  getById(id: string): Workout | undefined {
    return this.workouts().find((w) => w.id === id);
  }

  add(item: Omit<Workout, 'id'>): void {
    const id = generateId(this.workouts());
    this.workouts.update((workouts) => [...workouts, { ...item, id }]);
  }

  update(item: Workout): void {
    this.workouts.update((workouts) => workouts.map((w) => (w.id === item.id ? item : w)));
  }

  delete(id: string): void {
    this.workouts.update((workouts) => workouts.filter((w) => w.id !== id));
  }
}
