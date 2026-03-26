import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Toolbar } from 'primeng/toolbar';
import { UserService } from '../data-access/user.service';
import { UserProfile } from '../model/user.model';
import { UserDialogComponent } from '../ui/user-dialog';

interface Column {
  field: string;
  headerKey: string;
}

@Component({
  selector: 'app-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [
    FormsModule,
    TranslocoDirective,
    ButtonModule,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    Select,
    TableModule,
    Tag,
    Toolbar,
    UserDialogComponent,
  ],
  template: `
    <div *transloco="let t" class="flex flex-col gap-6 h-full min-h-0">
      <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 shrink-0">{{ t('user.title') }}</h1>
      <div class="rounded-2xl bg-white/40 dark:bg-surface-800/40 backdrop-blur-sm overflow-hidden flex flex-col min-h-0 flex-1">
        <p-toolbar styleClass="border-none bg-transparent shrink-0">
          <ng-template #start>
            <p-multiselect
              [options]="allColumns"
              [(ngModel)]="selectedColumns"
              [optionLabel]="'headerKey'"
              [placeholder]="t('user.columns')"
              [maxSelectedLabels]="0"
              [selectedItemsLabel]="t('user.columnsSelected', { count: selectedColumns.length })"
              [style]="{ 'min-width': '14rem' }"
            >
              <ng-template #item let-col>
                {{ t(col.headerKey) }}
              </ng-template>
            </p-multiselect>
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
          [scrollable]="true"
          scrollHeight="flex"
          [globalFilterFields]="['username', 'displayName', 'email', 'role']"
          [showGridlines]="true"
          [tableStyle]="{ 'min-width': '30rem' }"
        >
          <ng-template #header>
            <tr>
              @for (col of selectedColumns; track col.field) {
                <th [pSortableColumn]="col.field">
                  {{ t(col.headerKey) }}
                  <p-sortIcon [field]="col.field" />
                  @if (col.field === 'role') {
                    <p-columnFilter field="role" matchMode="equals" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                      <ng-template #filter let-value let-filterCallback="filterCallback">
                        <p-select
                          [ngModel]="value"
                          (ngModelChange)="filterCallback($event)"
                          [options]="[
                            { label: t('user.roles.admin'), value: 'admin' },
                            { label: t('user.roles.user'), value: 'user' }
                          ]"
                          optionLabel="label"
                          optionValue="value"
                          [placeholder]="t('user.filterByRole')"
                          [showClear]="true"
                          [style]="{ 'min-width': '10rem' }"
                        />
                      </ng-template>
                    </p-columnFilter>
                  } @else {
                    <p-columnFilter [field]="col.field" matchMode="contains" display="menu" [showMatchModes]="false" [showOperator]="false" [showAddButton]="false">
                      <ng-template #filter let-value let-filterCallback="filterCallback">
                        <input
                          pInputText
                          type="text"
                          [ngModel]="value"
                          (ngModelChange)="filterCallback($event)"
                          [placeholder]="getFilterPlaceholder(col.headerKey)"
                          [style]="{ 'min-width': '10rem' }"
                        />
                      </ng-template>
                    </p-columnFilter>
                  }
                </th>
              }
            </tr>
          </ng-template>
          <ng-template #body let-user>
            <tr>
              @for (col of selectedColumns; track col.field) {
                @if (col.field === 'role') {
                  <td><p-tag [value]="t('user.roles.' + user[col.field])" [severity]="user[col.field] === 'admin' ? 'warn' : 'info'" /></td>
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
  private readonly transloco = inject(TranslocoService);
  protected readonly dialogVisible = signal(false);

  private readonly dt = viewChild<Table>('dt');

  protected readonly allColumns: Column[] = [
    { field: 'username', headerKey: 'user.username' },
    { field: 'displayName', headerKey: 'user.name' },
    { field: 'email', headerKey: 'user.email' },
    { field: 'role', headerKey: 'user.role' },
  ];

  protected selectedColumns: Column[] = [...this.allColumns];

  protected getFilterPlaceholder(headerKey: string): string {
    const field = this.transloco.translate(headerKey);
    return this.transloco.translate('user.filterBy', { field });
  }

  protected onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt()?.filterGlobal(value, 'contains');
  }

  protected onSaveUser(user: Omit<UserProfile, 'id'>): void {
    this.userService.add(user);
    this.dialogVisible.set(false);
  }
}
