import { computed, Injectable, signal } from '@angular/core';
import { AppUser } from './auth.model';
import { MOCK_ADMIN_USER } from './auth.mock';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<AppUser>(MOCK_ADMIN_USER);
  readonly isAdmin = computed(() => this.currentUser().role === 'admin');
}
