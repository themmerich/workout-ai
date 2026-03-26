import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  template: `
    <div
      *transloco="let t"
      class="h-[60px] flex justify-between items-center px-8 border-b bg-white/20 dark:bg-surface-900/20 border-white/30 dark:border-surface-700/30"
    >
      <button
        type="button"
        class="cursor-pointer flex items-center justify-center lg:hidden text-surface-700 dark:text-surface-200 bg-transparent border-none"
        (click)="toggleSidebar.emit()"
        [attr.aria-label]="'Toggle menu'"
      >
        <i class="pi pi-bars text-xl leading-none"></i>
      </button>
      <div class="hidden lg:block"></div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg bg-transparent border-none text-surface-700 dark:text-surface-200 hover:bg-white/40 dark:hover:bg-surface-700/40 transition-colors"
          (click)="toggleLanguage()"
          [attr.aria-label]="t('header.language')"
        >
          <span class="text-sm font-bold">{{ langLabel() }}</span>
        </button>
        <button
          type="button"
          class="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg bg-transparent border-none text-surface-700 dark:text-surface-200 hover:bg-white/40 dark:hover:bg-surface-700/40 transition-colors"
          (click)="themeService.toggle()"
          [attr.aria-label]="themeService.theme() === 'dark' ? t('header.lightMode') : t('header.darkMode')"
        >
          <i [class]="themeService.theme() === 'dark' ? 'pi pi-sun' : 'pi pi-moon'" class="text-lg"></i>
        </button>
      </div>
    </div>
  `,
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly translocoService = inject(TranslocoService);
  readonly toggleSidebar = output<void>();

  protected readonly langLabel = computed(() => {
    const lang = this.translocoService.getActiveLang();
    return lang.toUpperCase();
  });

  protected toggleLanguage(): void {
    const current = this.translocoService.getActiveLang();
    this.translocoService.setActiveLang(current === 'de' ? 'en' : 'de');
  }
}
