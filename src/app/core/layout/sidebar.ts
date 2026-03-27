import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoDirective],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly userMenuOpen = signal(false);
  readonly visible = input(false);
  readonly closeSidebar = output<void>();
}
