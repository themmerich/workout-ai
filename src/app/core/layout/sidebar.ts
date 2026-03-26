import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthService } from '../auth';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, TranslocoDirective],
  template: `
    <div
      *transloco="let t"
      class="w-[280px] backdrop-blur-lg h-screen shrink-0 z-10 border-r select-none bg-white/70 dark:bg-surface-900/70 border-white/30 dark:border-surface-700/30"
      [class.hidden]="!visible()"
      [class.lg:block]="!visible()"
      [class.block]="visible()"
      [class.absolute]="visible()"
      [class.lg:static]="true"
      [class.left-0]="true"
      [class.top-0]="true"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center p-4 gap-4 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none" class="w-10 h-10">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21.5 42.0498C33.098 42.0498 42.5 32.6477 42.5 21.0498C42.5 9.45183 33.098 0.0498047 21.5 0.0498047C9.902 0.0498047 0.5 9.45183 0.5 21.0498C0.5 32.6477 9.902 42.0498 21.5 42.0498ZM28.0513 9.83248C28.3702 8.69975 27.2709 8.02994 26.267 8.74516L12.2528 18.7288C11.164 19.5045 11.3353 21.0498 12.51 21.0498H16.2003V21.0212H23.3926L17.5323 23.089L14.9487 32.2671C14.6299 33.3999 15.729 34.0697 16.733 33.3544L30.7472 23.3708C31.836 22.5951 31.6646 21.0498 30.49 21.0498H24.8937L28.0513 9.83248Z"
              class="fill-surface-900 dark:fill-surface-0"
            />
          </svg>
          <div class="text-surface-900 dark:text-surface-0 text-lg font-semibold leading-tight">{{ t('app.title') }}</div>
        </div>
        <div class="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          <a
            routerLink="/"
            routerLinkActive="bg-white/80 dark:bg-surface-950/50"
            [routerLinkActiveOptions]="{ exact: true }"
            class="p-3 rounded-lg flex items-center gap-2 cursor-pointer text-surface-700 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-white/80 dark:hover:bg-surface-950/50 duration-150 transition-colors group"
            (click)="closeSidebar.emit()"
          >
            <i class="pi pi-home text-base leading-tight text-surface-700 dark:text-surface-200 group-hover:text-surface-900 dark:group-hover:text-surface-0"></i>
            <span class="flex-1 text-base font-medium leading-tight">{{ t('nav.dashboard') }}</span>
          </a>
          <a
            routerLink="/user"
            routerLinkActive="bg-white/80 dark:bg-surface-950/50"
            class="p-3 rounded-lg flex items-center gap-2 cursor-pointer text-surface-700 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-white/80 dark:hover:bg-surface-950/50 duration-150 transition-colors group"
            (click)="closeSidebar.emit()"
          >
            <i class="pi pi-user text-base leading-tight text-surface-700 dark:text-surface-200 group-hover:text-surface-900 dark:group-hover:text-surface-0"></i>
            <span class="flex-1 text-base font-medium leading-tight">{{ t('nav.user') }}</span>
          </a>
          @if (authService.isAdmin()) {
            <a
              routerLink="/settings"
              routerLinkActive="bg-white/80 dark:bg-surface-950/50"
              class="p-3 rounded-lg flex items-center gap-2 cursor-pointer text-surface-700 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-white/80 dark:hover:bg-surface-950/50 duration-150 transition-colors group"
              (click)="closeSidebar.emit()"
            >
              <i class="pi pi-cog text-base leading-tight text-surface-700 dark:text-surface-200 group-hover:text-surface-900 dark:group-hover:text-surface-0"></i>
              <span class="flex-1 text-base font-medium leading-tight">{{ t('nav.settings') }}</span>
            </a>
          }
        </div>
        <div class="mt-auto border-t border-white/30 dark:border-surface-700/50 p-3">
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-xl text-surface-700 dark:text-surface-200"></i>
            <span class="text-surface-900 dark:text-surface-0 text-base font-medium leading-tight">{{ authService.currentUser().displayName }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SidebarComponent {
  protected readonly authService = inject(AuthService);
  readonly visible = input(false);
  readonly closeSidebar = output<void>();
}
