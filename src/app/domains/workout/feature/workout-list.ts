import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-workout-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  template: `
    <section *transloco="let t">
      <h2 class="text-2xl font-semibold">{{ t('app.title') }}</h2>
    </section>
  `,
})
export default class WorkoutListComponent {}
