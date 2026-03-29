import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { EquipmentService } from '../../equipment/data-access/equipment.service';
import { EquipmentCategory, EQUIPMENT_CATEGORIES } from '../../equipment/model/equipment.model';
import { LocationService } from '../../location/data-access/location.service';
import {
  EquipmentEntryData,
  EquipmentOptionWithCategory,
  LocationEquipmentEntryDialogComponent,
} from '../../location/ui/location-equipment-entry-dialog';

interface EquipmentRow {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  quantity: number;
  weight: number | null;
}

@Component({
  selector: 'app-my-location-equipment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  providers: [MessageService],
  imports: [TranslocoDirective, Tag, Toast, DataTableComponent, LocationEquipmentEntryDialogComponent],
  templateUrl: './my-location-equipment.html',
})
export default class MyLocationEquipmentComponent {
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly equipmentService = inject(EquipmentService);
  private readonly transloco = inject(TranslocoService);
  private readonly messageService = inject(MessageService);

  protected readonly dialogVisible = signal(false);
  protected readonly editingEntry = signal<EquipmentEntryData | null>(null);

  protected readonly equipmentRows = computed<EquipmentRow[]>(() => {
    const user = this.authService.currentUser();
    if (!user?.locationId) return [];
    const location = this.locationService.getById(user.locationId);
    if (!location) return [];
    return location.equipment.map((le, index) => {
      const eq = this.equipmentService.getById(le.equipmentId);
      return {
        id: String(index),
        equipmentId: le.equipmentId,
        equipmentName: eq?.name ?? le.equipmentId,
        equipmentCategory: eq?.category ?? '',
        quantity: le.quantity,
        weight: le.weight,
      };
    });
  });

  protected readonly equipmentOptions = computed<EquipmentOptionWithCategory[]>(() =>
    this.equipmentService.equipment().map((e) => ({
      label: e.name,
      value: e.id,
      category: e.category,
    })),
  );

  protected readonly categoryFilterOptions = computed(() =>
    EQUIPMENT_CATEGORIES.map((cat) => ({
      label: this.transloco.translate('equipment.categories.' + cat),
      value: cat,
    })),
  );

  protected readonly columns = computed<TableColumn[]>(() => [
    { field: 'equipmentName', headerKey: 'myLocation.equipment.name' },
    {
      field: 'equipmentCategory',
      headerKey: 'myLocation.equipment.category',
      filterMode: 'select',
      filterPlaceholderKey: 'myLocation.equipment.filterByCategory',
      filterOptions: this.categoryFilterOptions(),
    },
    { field: 'quantity', headerKey: 'myLocation.equipment.quantity' },
    { field: 'weight', headerKey: 'myLocation.equipment.weight' },
  ]);

  protected readonly globalFilterFields = ['equipmentName', 'equipmentCategory'];

  protected readonly translations: DataTableTranslations = {
    columns: 'myLocation.equipment.columns',
    columnsSelected: 'myLocation.equipment.columnsSelected',
    search: 'myLocation.equipment.search',
    addButton: 'myLocation.equipment.add',
    actions: 'myLocation.equipment.actions',
    edit: 'myLocation.equipment.edit',
    delete: 'myLocation.equipment.delete',
    filterBy: 'myLocation.equipment.filterBy',
    confirmDeleteTitle: 'myLocation.equipment.confirmDeleteTitle',
    confirmDelete: 'myLocation.equipment.confirmDelete',
    createSuccess: 'myLocation.equipment.createSuccess',
    updateSuccess: 'myLocation.equipment.updateSuccess',
    deleteSuccess: 'myLocation.equipment.deleteSuccess',
    deleteError: 'myLocation.equipment.deleteError',
    dialogDelete: 'myLocation.equipment.dialogDelete',
    dialogCancel: 'myLocation.equipment.dialogCancel',
    clearFilters: 'myLocation.equipment.clearFilters',
  };

  private readonly categorySeverityMap: Record<EquipmentCategory, 'info' | 'warn' | 'success' | 'secondary' | 'contrast'> = {
    mobility: 'info',
    dumbbell: 'warn',
    cardio: 'success',
    cable: 'secondary',
    machine: 'secondary',
    bodyweight: 'contrast',
    other: 'info',
  };

  protected getCategorySeverity(category: string): 'info' | 'warn' | 'success' | 'secondary' | 'contrast' {
    return this.categorySeverityMap[category as EquipmentCategory] ?? 'info';
  }

  protected getCategoryLabel(category: string): string {
    return this.transloco.translate('equipment.categories.' + category);
  }

  protected onAdd(): void {
    this.editingEntry.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(row: EquipmentRow): void {
    this.editingEntry.set({ id: row.id, equipmentId: row.equipmentId, quantity: row.quantity, weight: row.weight });
    this.dialogVisible.set(true);
  }

  protected onDelete(row: EquipmentRow): void {
    const user = this.authService.currentUser();
    if (!user?.locationId) return;
    const location = this.locationService.getById(user.locationId);
    if (!location) return;

    const updatedEquipment = location.equipment.filter((_, i) => String(i) !== row.id);
    this.locationService.update({ ...location, equipment: updatedEquipment });
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('myLocation.equipment.deleteSuccess'),
      life: 3000,
    });
  }

  protected onEntrySaved(entry: EquipmentEntryData): void {
    const user = this.authService.currentUser();
    if (!user?.locationId) return;
    const location = this.locationService.getById(user.locationId);
    if (!location) return;

    const index = parseInt(entry.id, 10);
    let updatedEquipment;
    if (!isNaN(index) && index < location.equipment.length) {
      updatedEquipment = location.equipment.map((le, i) =>
        i === index ? { equipmentId: entry.equipmentId, quantity: entry.quantity, weight: entry.weight } : le,
      );
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('myLocation.equipment.updateSuccess'),
        life: 3000,
      });
    } else {
      updatedEquipment = [...location.equipment, { equipmentId: entry.equipmentId, quantity: entry.quantity, weight: entry.weight }];
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('myLocation.equipment.createSuccess'),
        life: 3000,
      });
    }
    this.locationService.update({ ...location, equipment: updatedEquipment });
    this.dialogVisible.set(false);
    this.editingEntry.set(null);
  }
}
