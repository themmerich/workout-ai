import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../theme';

interface LangOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, Select, ToggleSwitch, FormsModule],
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
      <div class="flex items-center gap-4">
        <p-select
          [options]="languages"
          [ngModel]="currentLang"
          (ngModelChange)="onLanguageChange($event)"
          optionLabel="label"
          optionValue="value"
          [style]="{ width: '100px' }"
          aria-label="Language"
        />
        <div class="flex items-center gap-2">
          <i class="pi pi-sun text-surface-700 dark:text-surface-200"></i>
          <p-toggleswitch
            [ngModel]="themeService.theme() === 'dark'"
            (ngModelChange)="themeService.toggle()"
            [attr.aria-label]="themeService.theme() === 'dark' ? t('header.darkMode') : t('header.lightMode')"
          />
          <i class="pi pi-moon text-surface-700 dark:text-surface-200"></i>
        </div>
      </div>
    </div>
  `,
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly translocoService = inject(TranslocoService);
  readonly toggleSidebar = output<void>();

  protected readonly languages: LangOption[] = [
    { label: 'DE', value: 'de' },
    { label: 'EN', value: 'en' },
  ];

  protected get currentLang(): string {
    return this.translocoService.getActiveLang();
  }

  protected onLanguageChange(lang: string): void {
    this.translocoService.setActiveLang(lang);
  }
}
