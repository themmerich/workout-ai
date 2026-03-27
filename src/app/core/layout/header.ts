import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ThemeService } from '../theme/theme.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  templateUrl: './header.html',
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
