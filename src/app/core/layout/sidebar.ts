import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { LocationService } from '../../domains/location/data-access/location.service';
import { LocationLogoComponent } from '../../domains/location/ui/location-logo';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoDirective, LocationLogoComponent],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  protected readonly userMenuOpen = signal(false);
  readonly visible = input(false);
  readonly closeSidebar = output<void>();

  protected readonly currentLocation = computed(() => {
    const user = this.authService.currentUser();
    if (user?.locationId) {
      return this.locationService.getById(user.locationId) ?? null;
    }
    return null;
  });
}
