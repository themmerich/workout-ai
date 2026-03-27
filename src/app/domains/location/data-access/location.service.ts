import { Injectable, signal } from '@angular/core';
import { Location } from '../model/location.model';
import { MOCK_LOCATIONS } from './location.mock';

@Injectable({ providedIn: 'root' })
export class LocationService {
  // TODO: Replace with HTTP calls to REST API
  readonly locations = signal<Location[]>(MOCK_LOCATIONS);

  getAll(): Location[] {
    return this.locations();
  }

  getById(id: string): Location | undefined {
    return this.locations().find((l) => l.id === id);
  }

  add(location: Omit<Location, 'id'>): void {
    const id = String(Math.max(...this.locations().map((l) => Number(l.id))) + 1);
    this.locations.update((locations) => [...locations, { ...location, id }]);
  }

  update(location: Location): void {
    this.locations.update((locations) => locations.map((l) => (l.id === location.id ? location : l)));
  }

  delete(id: string): void {
    this.locations.update((locations) => locations.filter((l) => l.id !== id));
  }
}
