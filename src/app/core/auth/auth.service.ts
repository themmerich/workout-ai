import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../domains/user/data-access/user.service';
import { LocationService } from '../../domains/location/data-access/location.service';
import { AppUser, UserLocationMembership } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);

  readonly currentUser = signal<AppUser | null>(null);
  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly hasLocation = computed(() => (this.currentUser()?.locations.length ?? 0) > 0);
  readonly hasMultipleLocations = computed(() => (this.currentUser()?.locations.length ?? 0) > 1);

  isOwnerAt(locationId: string): boolean {
    return this.currentUser()?.locations.some((l) => l.locationId === locationId && l.locationRole === 'owner') ?? false;
  }

  isOwner = computed(() =>
    this.currentUser()?.locations.some((l) => l.locationRole === 'owner') ?? false,
  );

  login(username: string, password: string): string | null {
    const user = this.userService.users().find((u) => u.username === username);
    if (!user) {
      return 'login.errors.userNotFound';
    }

    if (user.password !== password) {
      return 'login.errors.invalidPassword';
    }

    // Find all locations where the user is a member
    const locations: UserLocationMembership[] = [];
    for (const loc of this.locationService.locations()) {
      const member = loc.members.find((m) => m.userId === user.id);
      if (member) {
        locations.push({
          locationId: loc.id,
          locationName: loc.name,
          locationRole: member.role,
        });
      }
    }

    this.currentUser.set({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role as 'admin' | 'user',
      avatarUrl: '',
      locations,
    });
    return null;
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
