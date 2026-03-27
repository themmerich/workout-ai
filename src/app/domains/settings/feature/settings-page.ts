import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';
import { SettingsService } from '../data-access/settings.service';

@Component({
  selector: 'app-settings-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe, TranslocoDirective, CardModule],
  templateUrl: './settings-page.html',
})
export default class SettingsPageComponent {
  protected readonly settingsService = inject(SettingsService);
}
