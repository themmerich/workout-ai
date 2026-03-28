import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { LocationService } from '../../location/data-access/location.service';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { UserService } from '../data-access/user.service';
import { UserProfile } from '../model/user.model';
import { UserDialogComponent } from '../ui/user-dialog';

interface UserView extends UserProfile {
  locationIds: string[];
  locationNames: string[];
}

@Component({
  selector: 'app-user-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, Tag, DataTableComponent, UserDialogComponent],
  templateUrl: './user-page.html',
})
export default class UserPageComponent {
  protected readonly userService = inject(UserService);
  private readonly locationService = inject(LocationService);
  private readonly transloco = inject(TranslocoService);
  protected readonly dialogVisible = signal(false);
  protected readonly editingUser = signal<UserProfile | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<UserView>>('dataTable');

  protected readonly userViews = computed<UserView[]>(() => {
    const locations = this.locationService.locations();
    return this.userService.users().map((user) => {
      const userLocations = locations.filter((l) =>
        l.members.some((m) => m.userId === user.id),
      );
      return {
        ...user,
        locationIds: userLocations.map((l) => l.id),
        locationNames: userLocations.map((l) => l.name),
      };
    });
  });

  protected readonly locationFilterOptions = computed(() =>
    this.locationService.locations().map((l) => ({
      label: l.name,
      value: l.id,
    })),
  );

  protected readonly columns = computed<TableColumn[]>(() => [
    { field: 'username', headerKey: 'user.username' },
    { field: 'displayName', headerKey: 'user.name' },
    { field: 'email', headerKey: 'user.email' },
    {
      field: 'role',
      headerKey: 'user.role',
      filterMode: 'select',
      filterPlaceholderKey: 'user.filterByRole',
      filterOptions: [
        { label: this.transloco.translate('user.roles.admin'), value: 'admin' },
        { label: this.transloco.translate('user.roles.user'), value: 'user' },
      ],
    },
    {
      field: 'locationIds',
      headerKey: 'user.locations',
      filterMode: 'multiselect',
      filterPlaceholderKey: 'user.filterByLocation',
      filterSelectedItemsLabelKey: 'user.filterLocationsSelected',
      filterOptions: this.locationFilterOptions(),
    },
  ]);

  protected readonly globalFilterFields = ['username', 'displayName', 'email', 'role', 'locationNames'];

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
    clearFilters: 'user.clearFilters',
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

  protected onEdit(view: UserView): void {
    const user = this.userService.getById(view.id);
    if (user) {
      this.editingUser.set(user);
      this.dialogVisible.set(true);
    }
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

  protected onDelete(view: UserView): void {
    try {
      this.userService.delete(view.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
