import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { UserProfile } from '../model/user.model';
import { MOCK_USERS } from './user.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  // TODO: Replace with HTTP calls to REST API
  readonly users = signal<UserProfile[]>(MOCK_USERS);

  getById(id: string): UserProfile | undefined {
    return this.users().find((u) => u.id === id);
  }

  add(user: Omit<UserProfile, 'id'>): void {
    const id = generateId(this.users());
    this.users.update((users) => [...users, { ...user, id }]);
  }

  update(user: UserProfile): void {
    this.users.update((users) => users.map((u) => (u.id === user.id ? user : u)));
  }

  delete(id: string): void {
    this.users.update((users) => users.filter((u) => u.id !== id));
  }
}
