import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LocationService } from '../../domains/location/data-access/location.service';
import { Location } from '../../domains/location/model/location.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoDirective],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  protected readonly userMenuOpen = signal(false);
  protected readonly workoutMenuOpen = signal(false);
  private readonly expandedLocations = signal(new Set<string>());
  readonly visible = input(false);
  readonly closeSidebar = output<void>();

  protected readonly userLocations = computed<Location[]>(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return user.locations
      .map((m) => this.locationService.getById(m.locationId))
      .filter((l): l is NonNullable<typeof l> => l !== undefined);
  });

  protected isLocationExpanded(locationId: string): boolean {
    return this.expandedLocations().has(locationId);
  }

  protected toggleLocationMenu(locationId: string): void {
    this.expandedLocations.update((set) => {
      const next = new Set(set);
      if (next.has(locationId)) {
        next.delete(locationId);
      } else {
        next.add(locationId);
      }
      return next;
    });
  }

  protected isOwnerOfLocation(locationId: string): boolean {
    return this.authService.isOwnerAt(locationId);
  }
}
