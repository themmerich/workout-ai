import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { ExerciseCombo } from '../model/exercise-combo.model';
import { MOCK_EXERCISE_COMBOS } from './exercise-combo.mock';

@Injectable({ providedIn: 'root' })
export class ExerciseComboService {
  // TODO: Replace mock data with HTTP REST API calls
  readonly exerciseCombos = signal<ExerciseCombo[]>(MOCK_EXERCISE_COMBOS);

  getById(id: string): ExerciseCombo | undefined {
    return this.exerciseCombos().find((c) => c.id === id);
  }

  add(item: Omit<ExerciseCombo, 'id'>): void {
    const id = generateId(this.exerciseCombos());
    this.exerciseCombos.update((combos) => [...combos, { ...item, id }]);
  }

  update(item: ExerciseCombo): void {
    this.exerciseCombos.update((combos) => combos.map((c) => (c.id === item.id ? item : c)));
  }

  delete(id: string): void {
    this.exerciseCombos.update((combos) => combos.filter((c) => c.id !== id));
  }
}
