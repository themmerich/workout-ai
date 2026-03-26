import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TableModule } from 'primeng/table';
import { UserService } from '../data-access';

@Component({
  selector: 'app-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, TableModule],
  template: `
    <div *transloco="let t" class="flex flex-col gap-6">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ t('user.title') }}</h1>
      <div class="rounded-2xl bg-white/40 dark:bg-surface-800/40 backdrop-blur-sm overflow-hidden">
        <p-table [value]="userService.users()" [tableStyle]="{ 'min-width': '30rem' }">
          <ng-template #header>
            <tr>
              <th>{{ t('user.name') }}</th>
              <th>{{ t('user.email') }}</th>
              <th>{{ t('user.role') }}</th>
            </tr>
          </ng-template>
          <ng-template #body let-user>
            <tr>
              <td>{{ user.displayName }}</td>
              <td>{{ user.email }}</td>
              <td>{{ t('user.roles.' + user.role) }}</td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>
  `,
})
export default class UserPageComponent {
  protected readonly userService = inject(UserService);
}
