import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { Exercise } from '../model/exercise.model';
import { MOCK_EXERCISES } from './exercise.mock';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  // TODO: Replace with HTTP calls to REST API
  readonly exercises = signal<Exercise[]>(MOCK_EXERCISES);

  getById(id: string): Exercise | undefined {
    return this.exercises().find((e) => e.id === id);
  }

  add(item: Omit<Exercise, 'id'>): void {
    const id = generateId(this.exercises());
    this.exercises.update((list) => [...list, { ...item, id }]);
  }

  update(item: Exercise): void {
    this.exercises.update((list) => list.map((e) => (e.id === item.id ? item : e)));
  }

  delete(id: string): void {
    this.exercises.update((list) => list.filter((e) => e.id !== id));
  }
}
