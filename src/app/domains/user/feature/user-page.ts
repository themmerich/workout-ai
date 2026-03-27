import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { UserService } from '../data-access/user.service';
import { UserProfile } from '../model/user.model';
import { UserDialogComponent } from '../ui/user-dialog';

@Component({
  selector: 'app-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, Tag, DataTableComponent, UserDialogComponent],
  templateUrl: './user-page.html',
})
export default class UserPageComponent {
  protected readonly userService = inject(UserService);
  private readonly transloco = inject(TranslocoService);
  protected readonly dialogVisible = signal(false);
  protected readonly editingUser = signal<UserProfile | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<UserProfile>>('dataTable');

  protected readonly columns: TableColumn[] = [
    { field: 'username', headerKey: 'user.username' },
    { field: 'displayName', headerKey: 'user.name' },
    { field: 'email', headerKey: 'user.email' },
    {
      field: 'role',
      headerKey: 'user.role',
      filterMode: 'select',
      filterPlaceholderKey: 'user.filterByRole',
      filterOptions: [
        { label: 'Administrator', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ];

  protected readonly globalFilterFields = ['username', 'displayName', 'email', 'role'];

  protected readonly translations: DataTableTranslations = {
    columns: 'user.columns',
    columnsSelected: 'user.columnsSelected',
    search: 'user.search',
    addButton: 'user.addUser',
    actions: 'user.actions',
    edit: 'user.edit',
    delete: 'user.delete',
    filterBy: 'user.filterBy',
    confirmDeleteTitle: 'user.confirmDeleteTitle',
    confirmDelete: 'user.confirmDelete',
    createSuccess: 'user.createSuccess',
    updateSuccess: 'user.updateSuccess',
    deleteSuccess: 'user.deleteSuccess',
    deleteError: 'user.deleteError',
    dialogDelete: 'user.dialog.delete',
    dialogCancel: 'user.dialog.cancel',
  };

  protected getRoleSeverity(role: string): 'warn' | 'info' {
    return role === 'admin' ? 'warn' : 'info';
  }

  protected getRoleLabel(role: string): string {
    return this.transloco.translate('user.roles.' + role);
  }

  protected onAdd(): void {
    this.editingUser.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(user: UserProfile): void {
    this.editingUser.set(user);
    this.dialogVisible.set(true);
  }

  protected onSaveUser(user: UserProfile | Omit<UserProfile, 'id'>): void {
    if ('id' in user && user.id) {
      this.userService.update(user as UserProfile);
      this.dataTable()?.showSuccess(this.translations.updateSuccess);
    } else {
      this.userService.add(user as Omit<UserProfile, 'id'>);
      this.dataTable()?.showSuccess(this.translations.createSuccess);
    }
    this.dialogVisible.set(false);
    this.editingUser.set(null);
  }

  protected onDelete(user: UserProfile): void {
    try {
      this.userService.delete(user.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
