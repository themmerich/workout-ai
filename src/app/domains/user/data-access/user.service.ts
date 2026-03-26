import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../model';
import { MOCK_USERS } from './user.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  // TODO: Replace with HTTP calls to REST API
  readonly users = signal<UserProfile[]>(MOCK_USERS);

  getAll(): UserProfile[] {
    return this.users();
  }

  getById(id: string): UserProfile | undefined {
    return this.users().find((u) => u.id === id);
  }
}
