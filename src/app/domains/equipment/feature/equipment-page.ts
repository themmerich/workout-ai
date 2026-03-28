import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { EquipmentService } from '../data-access/equipment.service';
import { Equipment, EquipmentCategory } from '../model/equipment.model';
import { EquipmentDialogComponent } from '../ui/equipment-dialog';

@Component({
  selector: 'app-equipment-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, Tag, DataTableComponent, EquipmentDialogComponent],
  templateUrl: './equipment-page.html',
})
export default class EquipmentPageComponent {
  protected readonly equipmentService = inject(EquipmentService);
  private readonly transloco = inject(TranslocoService);
  protected readonly dialogVisible = signal(false);
  protected readonly editingEquipment = signal<Equipment | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<Equipment>>('dataTable');

  protected readonly columns: TableColumn[] = [
    { field: 'name', headerKey: 'equipment.name' },
    {
      field: 'category',
      headerKey: 'equipment.category',
      filterMode: 'select',
      filterPlaceholderKey: 'equipment.filterByCategory',
      filterOptions: [
        { label: 'Mobility', value: 'mobility' },
        { label: 'Hantel', value: 'dumbbell' },
        { label: 'Cardio', value: 'cardio' },
        { label: 'Kabelzug', value: 'cable' },
        { label: 'Maschine', value: 'machine' },
        { label: 'Bodyweight', value: 'bodyweight' },
        { label: 'Sonstiges', value: 'other' },
      ],
    },
  ];

  protected readonly globalFilterFields = ['name', 'category'];

  protected readonly translations: DataTableTranslations = {
    columns: 'equipment.columns',
    columnsSelected: 'equipment.columnsSelected',
    search: 'equipment.search',
    addButton: 'equipment.addEquipment',
    actions: 'equipment.actions',
    edit: 'equipment.edit',
    delete: 'equipment.delete',
    filterBy: 'equipment.filterBy',
    confirmDeleteTitle: 'equipment.confirmDeleteTitle',
    confirmDelete: 'equipment.confirmDelete',
    createSuccess: 'equipment.createSuccess',
    updateSuccess: 'equipment.updateSuccess',
    deleteSuccess: 'equipment.deleteSuccess',
    deleteError: 'equipment.deleteError',
    dialogDelete: 'equipment.dialog.delete',
    dialogCancel: 'equipment.dialog.cancel',
    clearFilters: 'equipment.clearFilters',
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

  protected onAdd(): void {
    this.editingEquipment.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(item: Equipment): void {
    this.editingEquipment.set(item);
    this.dialogVisible.set(true);
  }

  protected onSaveEquipment(item: Equipment | Omit<Equipment, 'id'>): void {
    if ('id' in item && item.id) {
      this.equipmentService.update(item as Equipment);
      this.dataTable()?.showSuccess(this.translations.updateSuccess);
    } else {
      this.equipmentService.add(item as Omit<Equipment, 'id'>);
      this.dataTable()?.showSuccess(this.translations.createSuccess);
    }
    this.dialogVisible.set(false);
    this.editingEquipment.set(null);
  }

  protected onDelete(item: Equipment): void {
    try {
      this.equipmentService.delete(item.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
