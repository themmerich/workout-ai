import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { Toolbar } from 'primeng/toolbar';
import { UserService } from '../data-access/user.service';
import { UserProfile } from '../model/user.model';
import { UserDialogComponent } from '../ui/user-dialog';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoDirective,
    ButtonModule,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    TableModule,
    Toolbar,
    UserDialogComponent,
  ],
  template: `
    <div *transloco="let t" class="flex flex-col gap-6">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0">{{ t('user.title') }}</h1>
      <div class="rounded-2xl bg-white/40 dark:bg-surface-800/40 backdrop-blur-sm overflow-hidden">
        <p-toolbar styleClass="border-none bg-transparent">
          <ng-template #start>
            <p-multiselect
              [options]="allColumns"
              [(ngModel)]="selectedColumns"
              optionLabel="header"
              [placeholder]="t('user.columns')"
              [maxSelectedLabels]="0"
              [selectedItemsLabel]="'{0}'"
              [style]="{ 'min-width': '10rem' }"
            />
          </ng-template>
          <ng-template #center>
            <p-iconfield>
              <p-inputicon styleClass="pi pi-search" />
              <input
                pInputText
                type="text"
                [placeholder]="t('user.search')"
                (input)="onGlobalFilter($event)"
              />
            </p-iconfield>
          </ng-template>
          <ng-template #end>
            <p-button
              [label]="t('user.addUser')"
              icon="pi pi-plus"
              (onClick)="dialogVisible.set(true)"
            />
          </ng-template>
        </p-toolbar>
        <p-table
          #dt
          [value]="userService.users()"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 25]"
          [globalFilterFields]="['username', 'displayName', 'email', 'role']"
          [tableStyle]="{ 'min-width': '30rem' }"
        >
          <ng-template #header>
            <tr>
              @for (col of selectedColumns; track col.field) {
                <th [pSortableColumn]="col.field">
                  {{ col.header }}
                  <p-sortIcon [field]="col.field" />
                </th>
              }
            </tr>
            <tr>
              @for (col of selectedColumns; track col.field) {
                <th>
                  <p-columnFilter
                    [field]="col.field"
                    matchMode="contains"
                    [showMenu]="false"
                  >
                    <ng-template #filter let-value let-filterCallback="filterCallback">
                      <input
                        pInputText
                        type="text"
                        [value]="value"
                        (input)="filterCallback($any($event.target).value)"
                        class="w-full"
                        [style]="{ 'min-width': '6rem' }"
                      />
                    </ng-template>
                  </p-columnFilter>
                </th>
              }
            </tr>
          </ng-template>
          <ng-template #body let-user>
            <tr>
              @for (col of selectedColumns; track col.field) {
                @if (col.field === 'role') {
                  <td>{{ t('user.roles.' + user[col.field]) }}</td>
                } @else {
                  <td>{{ user[col.field] }}</td>
                }
              }
            </tr>
          </ng-template>
        </p-table>
      </div>

      <app-user-dialog
        [visible]="dialogVisible()"
        (userSaved)="onSaveUser($event)"
        (dialogClosed)="dialogVisible.set(false)"
      />
    </div>
  `,
})
export default class UserPageComponent {
  protected readonly userService = inject(UserService);
  protected readonly dialogVisible = signal(false);

  private readonly dt = viewChild<Table>('dt');

  protected readonly allColumns: Column[] = [
    { field: 'username', header: 'Username' },
    { field: 'displayName', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' },
  ];

  protected selectedColumns: Column[] = [...this.allColumns];

  protected onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt()?.filterGlobal(value, 'contains');
  }

  protected onSaveUser(user: Omit<UserProfile, 'id'>): void {
    this.userService.add(user);
    this.dialogVisible.set(false);
  }
}
