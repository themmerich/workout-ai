import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  template: `
    <header *transloco="let t" class="flex items-center justify-between px-6 py-4 shadow-sm">
      <h1 class="text-xl font-bold">{{ t('app.title') }}</h1>
    </header>
  `,
})
export class HeaderComponent {}
