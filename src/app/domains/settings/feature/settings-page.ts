import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';
import { SettingsService } from '../data-access/settings.service';

@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, TranslocoDirective, CardModule],
  template: `
    <div *transloco="let t" class="flex flex-col gap-6">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ t('settings.title') }}</h1>
      <p class="text-surface-600 dark:text-surface-300">{{ t('settings.description') }}</p>
      <p-card [header]="t('settings.general')">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <span class="text-surface-700 dark:text-surface-200">{{ t('settings.language') }}</span>
            <span class="text-surface-900 dark:text-surface-0 font-medium">{{ settingsService.settings().language | uppercase }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-surface-700 dark:text-surface-200">{{ t('settings.theme') }}</span>
            <span class="text-surface-900 dark:text-surface-0 font-medium">{{ settingsService.settings().theme }}</span>
          </div>
        </div>
      </p-card>
    </div>
  `,
})
export default class SettingsPageComponent {
  protected readonly settingsService = inject(SettingsService);
}
