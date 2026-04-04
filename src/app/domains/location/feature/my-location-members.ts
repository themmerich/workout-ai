import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { LocationService } from '../data-access/location.service';
import { LOCATION_MEMBER_ROLES } from '../model/location.model';
import {
  LocationMemberEntryDialogComponent,
  MemberEntryData,
} from '../ui/location-member-entry-dialog';
import { UserService } from '../../user/data-access/user.service';

interface MemberRow {
  id: string;
  userName: string;
  userEmail: string;
  role: string;
  password: string;
}

@Component({
  selector: 'app-my-location-members',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  providers: [MessageService],
  imports: [TranslocoDirective, Tag, Toast, DataTableComponent, LocationMemberEntryDialogComponent],
  templateUrl: './my-location-members.html',
})
export default class MyLocationMembersComponent {
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly userService = inject(UserService);
  private readonly transloco = inject(TranslocoService);
  private readonly messageService = inject(MessageService);

  readonly locationId = input.required<string>();
  protected readonly dialogVisible = signal(false);
  protected readonly editingMember = signal<MemberEntryData | null>(null);

  protected readonly memberRows = computed<MemberRow[]>(() => {
    const location = this.locationService.getById(this.locationId());
    if (!location) return [];
    return location.members.map((m) => {
      const u = this.userService.getById(m.userId);
      return {
        id: m.userId,
        userName: u ? `${u.firstName} ${u.lastName}` : m.userId,
        userEmail: u?.email ?? '',
        role: m.role,
        password: m.password,
      };
    });
  });

  protected readonly userOptions = computed(() =>
    this.userService.users().map((u) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u.id,
    })),
  );

  protected readonly roleFilterOptions = computed(() =>
    LOCATION_MEMBER_ROLES.map((r) => ({
      label: this.transloco.translate('location.dialog.memberRoles.' + r),
      value: r,
    })),
  );

  protected readonly columns = computed<TableColumn[]>(() => [
    { field: 'userName', headerKey: 'myLocation.members.name' },
    { field: 'userEmail', headerKey: 'myLocation.members.email' },
    {
      field: 'role',
      headerKey: 'myLocation.members.role',
      filterMode: 'select',
      filterPlaceholderKey: 'myLocation.members.filterByRole',
      filterOptions: this.roleFilterOptions(),
    },
  ]);

  protected readonly globalFilterFields = ['userName', 'userEmail', 'role'];

  protected readonly translations: DataTableTranslations = {
    columns: 'myLocation.members.columns',
    columnsSelected: 'myLocation.members.columnsSelected',
    search: 'myLocation.members.search',
    addButton: 'myLocation.members.add',
    actions: 'myLocation.members.actions',
    edit: 'myLocation.members.edit',
    delete: 'myLocation.members.delete',
    filterBy: 'myLocation.members.filterBy',
    confirmDeleteTitle: 'myLocation.members.confirmDeleteTitle',
    confirmDelete: 'myLocation.members.confirmDelete',
    createSuccess: 'myLocation.members.createSuccess',
    updateSuccess: 'myLocation.members.updateSuccess',
    deleteSuccess: 'myLocation.members.deleteSuccess',
    deleteError: 'myLocation.members.deleteError',
    dialogDelete: 'myLocation.members.dialogDelete',
    dialogCancel: 'myLocation.members.dialogCancel',
    clearFilters: 'myLocation.members.clearFilters',
  };

  protected getRoleSeverity(role: string): 'warn' | 'success' | 'info' {
    switch (role) {
      case 'owner': return 'warn';
      case 'trainer': return 'success';
      default: return 'info';
    }
  }

  protected getRoleLabel(role: string): string {
    return this.transloco.translate('location.dialog.memberRoles.' + role);
  }

  protected onAdd(): void {
    this.editingMember.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(row: MemberRow): void {
    this.editingMember.set({ id: row.id, userId: row.id, role: row.role as 'owner' | 'trainer' | 'member', password: row.password });
    this.dialogVisible.set(true);
  }

  protected onDelete(row: MemberRow): void {
    const location = this.locationService.getById(this.locationId());
    if (!location) return;

    const updatedMembers = location.members.filter((m) => m.userId !== row.id);
    this.locationService.update({ ...location, members: updatedMembers });
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('myLocation.members.deleteSuccess'),
      life: 3000,
    });
  }

  protected onMemberSaved(entry: MemberEntryData): void {
    const location = this.locationService.getById(this.locationId());
    if (!location) return;

    const existing = location.members.findIndex((m) => m.userId === entry.userId);
    let updatedMembers;
    if (existing >= 0) {
      updatedMembers = location.members.map((m, i) =>
        i === existing ? { userId: entry.userId, role: entry.role, password: entry.password } : m,
      );
    } else {
      updatedMembers = [...location.members, { userId: entry.userId, role: entry.role, password: entry.password }];
    }
    this.locationService.update({ ...location, members: updatedMembers });
    this.dialogVisible.set(false);
    this.editingMember.set(null);
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate(existing >= 0 ? 'myLocation.members.updateSuccess' : 'myLocation.members.addSuccess'),
      life: 3000,
    });
  }
}
