import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { Location, LocationAnnouncement } from '../model/location.model';
import { MOCK_LOCATIONS } from './location.mock';

@Injectable({ providedIn: 'root' })
export class LocationService {
  // TODO: Replace with HTTP calls to REST API
  readonly locations = signal<Location[]>(MOCK_LOCATIONS);

  getById(id: string): Location | undefined {
    return this.locations().find((l) => l.id === id);
  }

  add(location: Omit<Location, 'id'>): void {
    const id = generateId(this.locations());
    this.locations.update((locations) => [...locations, { ...location, id }]);
  }

  update(location: Location): void {
    this.locations.update((locations) => locations.map((l) => (l.id === location.id ? location : l)));
  }

  delete(id: string): void {
    this.locations.update((locations) => locations.filter((l) => l.id !== id));
  }

  // Announcement operations
  addAnnouncement(locationId: string, item: Omit<LocationAnnouncement, 'id'>): void {
    this.locations.update((locations) =>
      locations.map((l) => {
        if (l.id !== locationId) return l;
        const id = generateId(l.announcements);
        return { ...l, announcements: [{ ...item, id }, ...l.announcements] };
      }),
    );
  }

  updateAnnouncement(locationId: string, item: LocationAnnouncement): void {
    this.locations.update((locations) =>
      locations.map((l) => {
        if (l.id !== locationId) return l;
        return { ...l, announcements: l.announcements.map((a) => (a.id === item.id ? item : a)) };
      }),
    );
  }

  deleteAnnouncement(locationId: string, announcementId: string): void {
    this.locations.update((locations) =>
      locations.map((l) => {
        if (l.id !== locationId) return l;
        return { ...l, announcements: l.announcements.filter((a) => a.id !== announcementId) };
      }),
    );
  }
}
