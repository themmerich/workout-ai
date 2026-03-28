import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Tag } from 'primeng/tag';
import { EquipmentService } from '../../equipment/data-access/equipment.service';
import { EquipmentCategory, EQUIPMENT_CATEGORIES } from '../../equipment/model/equipment.model';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { UserService } from '../../user/data-access/user.service';
import { Location, LocationEquipment, LocationLogo, LocationMember, LocationMemberRole, LOCATION_MEMBER_ROLES, LOGO_COLORS } from '../model/location.model';
import { LocationLogoComponent } from './location-logo';
import {
  EquipmentEntryData,
  LocationEquipmentEntryDialogComponent,
} from './location-equipment-entry-dialog';
import {
  MemberEntryData,
  LocationMemberEntryDialogComponent,
} from './location-member-entry-dialog';

export interface MemberRow {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: LocationMemberRole;
  password: string;
}

export interface EquipmentRow {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  quantity: number;
}

@Component({
  selector: 'app-location-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    InputText,
    Tabs, TabList, Tab, TabPanels, TabPanel,
    Tag,
    ButtonModule,
    DataTableComponent,
    LocationEquipmentEntryDialogComponent,
    LocationMemberEntryDialogComponent,
    LocationLogoComponent,
  ],
  templateUrl: './location-dialog.html',
})
export class LocationDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly equipmentService = inject(EquipmentService);
  private readonly userService = inject(UserService);
  private readonly transloco = inject(TranslocoService);

  readonly visible = input(false);
  readonly location = input<Location | null>(null);
  readonly locationSaved = output<Location | Omit<Location, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly logoColors = LOGO_COLORS;
  protected readonly logoColor = signal(LOGO_COLORS[0]);
  protected readonly logoImageUrl = signal<string | null>(null);

  protected readonly equipmentRows = signal<EquipmentRow[]>([]);
  protected readonly entryDialogVisible = signal(false);
  protected readonly editingEntry = signal<EquipmentEntryData | null>(null);
  protected equipmentDirty = signal(false);

  protected readonly memberRows = signal<MemberRow[]>([]);
  protected readonly memberDialogVisible = signal(false);
  protected readonly editingMember = signal<MemberEntryData | null>(null);
  protected membersDirty = signal(false);

  protected readonly equipmentOptions = computed(() =>
    this.equipmentService.equipment().map((e) => ({
      label: e.name,
      value: e.id,
    })),
  );

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    street: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['', Validators.required],
    country: [''],
    phone: [''],
    email: ['', Validators.email],
    website: [''],
  });

  protected readonly categoryFilterOptions = computed(() =>
    EQUIPMENT_CATEGORIES.map((cat) => ({
      label: this.transloco.translate('equipment.categories.' + cat),
      value: cat,
    })),
  );

  protected readonly equipmentColumns = computed<TableColumn[]>(() => [
    { field: 'equipmentName', headerKey: 'location.dialog.equipmentName' },
    {
      field: 'equipmentCategory',
      headerKey: 'location.dialog.equipmentCategory',
      filterMode: 'select',
      filterPlaceholderKey: 'location.dialog.eqFilterByCategory',
      filterOptions: this.categoryFilterOptions(),
    },
    { field: 'quantity', headerKey: 'location.dialog.equipmentQuantity' },
  ]);

  private readonly categorySeverityMap: Record<EquipmentCategory, 'info' | 'warn' | 'success' | 'secondary' | 'contrast'> = {
    mobility: 'info',
    dumbbell: 'warn',
    barbell: 'warn',
    cardio: 'success',
    cable: 'secondary',
    machine: 'secondary',
    bodyweight: 'contrast',
    other: 'info',
  };

  protected readonly equipmentGlobalFilterFields = ['equipmentName', 'equipmentCategory'];

  protected readonly userOptions = computed(() =>
    this.userService.users().map((u) => ({
      label: u.displayName,
      value: u.id,
    })),
  );

  protected readonly memberRoleFilterOptions = computed(() =>
    LOCATION_MEMBER_ROLES.map((r) => ({
      label: this.transloco.translate('location.dialog.memberRoles.' + r),
      value: r,
    })),
  );

  protected readonly memberColumns = computed<TableColumn[]>(() => [
    { field: 'userName', headerKey: 'location.dialog.memberName' },
    { field: 'userEmail', headerKey: 'location.dialog.memberEmail' },
    {
      field: 'role',
      headerKey: 'location.dialog.memberRole',
      filterMode: 'select',
      filterPlaceholderKey: 'location.dialog.memFilterByRole',
      filterOptions: this.memberRoleFilterOptions(),
    },
  ]);

  protected readonly memberGlobalFilterFields = ['userName', 'userEmail', 'role'];

  protected readonly memberTranslations: DataTableTranslations = {
    columns: 'location.dialog.memColumns',
    columnsSelected: 'location.dialog.memColumnsSelected',
    search: 'location.dialog.memSearch',
    addButton: 'location.dialog.addMember',
    actions: 'location.dialog.memActions',
    edit: 'location.dialog.editMember',
    delete: 'location.dialog.removeMember',
    filterBy: 'location.dialog.memFilterBy',
    confirmDeleteTitle: 'location.dialog.memConfirmDeleteTitle',
    confirmDelete: 'location.dialog.memConfirmDelete',
    createSuccess: 'location.dialog.memCreateSuccess',
    updateSuccess: 'location.dialog.memUpdateSuccess',
    deleteSuccess: 'location.dialog.memDeleteSuccess',
    deleteError: 'location.dialog.memDeleteError',
    dialogDelete: 'location.dialog.memDialogDelete',
    dialogCancel: 'location.dialog.cancel',
    clearFilters: 'location.dialog.memClearFilters',
  };

  protected readonly equipmentTranslations: DataTableTranslations = {
    columns: 'location.dialog.eqColumns',
    columnsSelected: 'location.dialog.eqColumnsSelected',
    search: 'location.dialog.eqSearch',
    addButton: 'location.dialog.addEquipment',
    actions: 'location.dialog.eqActions',
    edit: 'location.dialog.editEquipment',
    delete: 'location.dialog.removeEquipment',
    filterBy: 'location.dialog.eqFilterBy',
    confirmDeleteTitle: 'location.dialog.eqConfirmDeleteTitle',
    confirmDelete: 'location.dialog.eqConfirmDelete',
    createSuccess: 'location.dialog.eqCreateSuccess',
    updateSuccess: 'location.dialog.eqUpdateSuccess',
    deleteSuccess: 'location.dialog.eqDeleteSuccess',
    deleteError: 'location.dialog.eqDeleteError',
    dialogDelete: 'location.dialog.eqDialogDelete',
    dialogCancel: 'location.dialog.cancel',
    clearFilters: 'location.dialog.eqClearFilters',
  };

  constructor() {
    effect(() => {
      const data = this.location();
      if (data) {
        this.form.patchValue(data);
        this.logoColor.set(data.logo?.color ?? LOGO_COLORS[0]);
        this.logoImageUrl.set(data.logo?.imageUrl ?? null);
        this.equipmentRows.set(this.toEquipmentRows(data.equipment));
        this.memberRows.set(this.toMemberRows(data.members));
      } else {
        this.form.reset();
        this.logoColor.set(LOGO_COLORS[0]);
        this.logoImageUrl.set(null);
        this.equipmentRows.set([]);
        this.memberRows.set([]);
      }
      this.equipmentDirty.set(false);
      this.membersDirty.set(false);
    });
  }

  protected onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoImageUrl.set(reader.result as string);
        this.equipmentDirty.set(true);
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  protected onLogoImageRemove(): void {
    this.logoImageUrl.set(null);
    this.equipmentDirty.set(true);
  }

  protected onLogoColorChange(color: string): void {
    this.logoColor.set(color);
    this.equipmentDirty.set(true);
  }

  protected get isFormDirty(): boolean {
    return this.form.dirty || this.equipmentDirty() || this.membersDirty();
  }

  protected onEquipmentAdd(): void {
    this.editingEntry.set(null);
    this.entryDialogVisible.set(true);
  }

  protected onEquipmentEdit(row: EquipmentRow): void {
    this.editingEntry.set({ id: row.id, equipmentId: row.equipmentId, quantity: row.quantity });
    this.entryDialogVisible.set(true);
  }

  protected onEquipmentDelete(row: EquipmentRow): void {
    this.equipmentRows.update((rows) => rows.filter((r) => r.id !== row.id));
    this.equipmentDirty.set(true);
  }

  protected onEntrySaved(entry: EquipmentEntryData): void {
    const eq = this.equipmentService.getById(entry.equipmentId);
    const row: EquipmentRow = {
      id: entry.id,
      equipmentId: entry.equipmentId,
      equipmentName: eq?.name ?? entry.equipmentId,
      equipmentCategory: eq?.category ?? '',
      quantity: entry.quantity,
    };

    this.equipmentRows.update((rows) => {
      const existing = rows.findIndex((r) => r.id === entry.id);
      if (existing >= 0) {
        return rows.map((r, i) => (i === existing ? row : r));
      }
      return [...rows, row];
    });

    this.entryDialogVisible.set(false);
    this.editingEntry.set(null);
    this.equipmentDirty.set(true);
  }

  protected getCategoryLabel(category: string): string {
    return this.transloco.translate('equipment.categories.' + category);
  }

  protected getCategorySeverity(category: string): 'info' | 'warn' | 'success' | 'secondary' | 'contrast' {
    return this.categorySeverityMap[category as EquipmentCategory] ?? 'info';
  }

  protected onMemberAdd(): void {
    this.editingMember.set(null);
    this.memberDialogVisible.set(true);
  }

  protected onMemberEdit(row: MemberRow): void {
    this.editingMember.set({ id: row.id, userId: row.userId, role: row.role, password: row.password });
    this.memberDialogVisible.set(true);
  }

  protected onMemberDelete(row: MemberRow): void {
    this.memberRows.update((rows) => rows.filter((r) => r.id !== row.id));
    this.membersDirty.set(true);
  }

  protected onMemberSaved(entry: MemberEntryData): void {
    const user = this.userService.getById(entry.userId);
    const row: MemberRow = {
      id: entry.id,
      userId: entry.userId,
      userName: user?.displayName ?? entry.userId,
      userEmail: user?.email ?? '',
      role: entry.role,
      password: entry.password,
    };

    this.memberRows.update((rows) => {
      const existing = rows.findIndex((r) => r.id === entry.id);
      if (existing >= 0) {
        return rows.map((r, i) => (i === existing ? row : r));
      }
      return [...rows, row];
    });

    this.memberDialogVisible.set(false);
    this.editingMember.set(null);
    this.membersDirty.set(true);
  }

  protected getMemberRoleLabel(role: string): string {
    return this.transloco.translate('location.dialog.memberRoles.' + role);
  }

  protected getMemberRoleSeverity(role: string): 'warn' | 'info' | 'success' {
    switch (role) {
      case 'owner': return 'warn';
      case 'trainer': return 'success';
      default: return 'info';
    }
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.location();
      const equipment: LocationEquipment[] = this.equipmentRows()
        .filter((r) => r.equipmentId)
        .map((r) => ({ equipmentId: r.equipmentId, quantity: r.quantity }));
      const members: LocationMember[] = this.memberRows()
        .filter((r) => r.userId)
        .map((r) => ({ userId: r.userId, role: r.role, password: r.password }));
      const logo: LocationLogo = { color: this.logoColor(), imageUrl: this.logoImageUrl() };

      if (data) {
        this.locationSaved.emit({ ...this.form.getRawValue(), id: data.id, logo, equipment, members });
      } else {
        this.locationSaved.emit({ ...this.form.getRawValue(), logo, equipment, members });
      }
      this.form.reset();
      this.equipmentRows.set([]);
      this.memberRows.set([]);
    }
  }

  private toMemberRows(members: LocationMember[]): MemberRow[] {
    return members.map((m) => {
      const user = this.userService.getById(m.userId);
      return {
        id: crypto.randomUUID(),
        userId: m.userId,
        userName: user?.displayName ?? m.userId,
        userEmail: user?.email ?? '',
        role: m.role,
        password: m.password,
      };
    });
  }

  private toEquipmentRows(equipment: LocationEquipment[]): EquipmentRow[] {
    return equipment.map((le) => {
      const eq = this.equipmentService.getById(le.equipmentId);
      return {
        id: crypto.randomUUID(),
        equipmentId: le.equipmentId,
        equipmentName: eq?.name ?? le.equipmentId,
        equipmentCategory: eq?.category ?? '',
        quantity: le.quantity,
      };
    });
  }
}
