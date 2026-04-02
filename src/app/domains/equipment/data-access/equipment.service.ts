import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { Equipment } from '../model/equipment.model';
import { MOCK_EQUIPMENT } from './equipment.mock';

@Injectable({ providedIn: 'root' })
export class EquipmentService {
  // TODO: Replace with HTTP calls to REST API
  readonly equipment = signal<Equipment[]>(MOCK_EQUIPMENT);

  getById(id: string): Equipment | undefined {
    return this.equipment().find((e) => e.id === id);
  }

  add(item: Omit<Equipment, 'id'>): void {
    const id = generateId(this.equipment());
    this.equipment.update((list) => [...list, { ...item, id }]);
  }

  update(item: Equipment): void {
    this.equipment.update((list) => list.map((e) => (e.id === item.id ? item : e)));
  }

  delete(id: string): void {
    this.equipment.update((list) => list.filter((e) => e.id !== id));
  }
}
