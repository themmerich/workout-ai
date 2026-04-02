import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../domains/user/data-access/user.service';
import { LocationService } from '../../domains/location/data-access/location.service';
import { AppUser } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  readonly currentUser = signal<AppUser | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly isOwner = computed(() => this.currentUser()?.locationRole === 'owner');
  readonly hasLocation = computed(() => this.currentUser()?.locationId !== null && this.currentUser()?.locationId !== undefined);

  login(username: string, password: string, locationId: string | null): string | null {
    const user = this.userService.users().find((u) => u.username === username);
    if (!user) {
      return 'login.errors.userNotFound';
    }

    if (user.role === 'admin') {
      if (user.password !== password) {
        return 'login.errors.invalidPassword';
      }
      this.currentUser.set({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: 'admin',
        avatarUrl: '',
        locationId: null,
        locationName: null,
        locationRole: null,
      });
      return null;
    }

    if (!locationId) {
      return 'login.errors.locationRequired';
    }

    const location = this.locationService.getById(locationId);
    if (!location) {
      return 'login.errors.locationNotFound';
    }

    const member = location.members.find((m) => m.userId === user.id);
    if (!member) {
      return 'login.errors.notMember';
    }

    if (member.password !== password) {
      return 'login.errors.invalidPassword';
    }

    this.currentUser.set({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: 'user',
      avatarUrl: '',
      locationId: location.id,
      locationName: location.name,
      locationRole: member.role,
    });
    return null;
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
