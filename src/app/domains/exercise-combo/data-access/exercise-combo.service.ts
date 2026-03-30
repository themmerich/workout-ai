import { Injectable, signal } from '@angular/core';
import { ExerciseCombo } from '../model/exercise-combo.model';
import { MOCK_EXERCISE_COMBOS } from './exercise-combo.mock';

@Injectable({ providedIn: 'root' })
export class ExerciseComboService {
  // TODO: Replace mock data with HTTP REST API calls
  readonly combos = signal<ExerciseCombo[]>(MOCK_EXERCISE_COMBOS);

  getAll(): ExerciseCombo[] {
    return this.combos();
  }

  getById(id: string): ExerciseCombo | undefined {
    return this.combos().find((c) => c.id === id);
  }

  add(item: Omit<ExerciseCombo, 'id'>): void {
    const maxId = this.combos().reduce((max, c) => Math.max(max, Number(c.id)), 0);
    this.combos.update((combos) => [...combos, { ...item, id: String(maxId + 1) }]);
  }

  update(item: ExerciseCombo): void {
    this.combos.update((combos) => combos.map((c) => (c.id === item.id ? item : c)));
  }

  delete(id: string): void {
    this.combos.update((combos) => combos.filter((c) => c.id !== id));
  }
}
