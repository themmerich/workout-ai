import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header';
import { SidebarComponent } from './sidebar';

@Component({
  selector: 'app-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div
      class="min-h-screen flex relative lg:static bg-surface-0 dark:bg-surface-900 bg-linear-to-br from-blue-100 from-40% via-pink-200 via-80% to-indigo-200 dark:from-blue-300/80 dark:via-pink-300/80 dark:to-indigo-400/80"
    >
      <app-sidebar [visible]="sidebarVisible()" (closeSidebar)="sidebarVisible.set(false)" />
      <div class="min-h-screen flex flex-col relative flex-auto">
        <app-header (toggleSidebar)="sidebarVisible.update((v) => !v)" />
        <div class="p-8 flex flex-col flex-auto">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class LayoutComponent {
  protected readonly sidebarVisible = signal(false);
}
