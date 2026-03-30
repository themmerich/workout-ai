import { Injectable, signal } from '@angular/core';
import { Workout } from '../model/workout.model';
import { MOCK_WORKOUTS } from './workout.mock';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  // TODO: Replace mock data with HTTP REST API calls
  readonly workouts = signal<Workout[]>(MOCK_WORKOUTS);

  getAll(): Workout[] {
    return this.workouts();
  }

  getByUserId(userId: string): Workout[] {
    return this.workouts().filter((w) => w.userId === userId);
  }

  getById(id: string): Workout | undefined {
    return this.workouts().find((w) => w.id === id);
  }

  add(item: Omit<Workout, 'id'>): void {
    const maxId = this.workouts().reduce((max, w) => Math.max(max, Number(w.id)), 0);
    this.workouts.update((workouts) => [...workouts, { ...item, id: String(maxId + 1) }]);
  }

  update(item: Workout): void {
    this.workouts.update((workouts) => workouts.map((w) => (w.id === item.id ? item : w)));
  }

  delete(id: string): void {
    this.workouts.update((workouts) => workouts.filter((w) => w.id !== id));
  }
}
