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
import { Location, LocationEquipment } from '../model/location.model';
import {
  EquipmentEntryData,
  LocationEquipmentEntryDialogComponent,
} from './location-equipment-entry-dialog';

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
  ],
  templateUrl: './location-dialog.html',
})
export class LocationDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly equipmentService = inject(EquipmentService);
  private readonly transloco = inject(TranslocoService);

  readonly visible = input(false);
  readonly location = input<Location | null>(null);
  readonly locationSaved = output<Location | Omit<Location, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly equipmentRows = signal<EquipmentRow[]>([]);
  protected readonly entryDialogVisible = signal(false);
  protected readonly editingEntry = signal<EquipmentEntryData | null>(null);
  protected equipmentDirty = signal(false);

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
        this.equipmentRows.set(this.toEquipmentRows(data.equipment));
      } else {
        this.form.reset();
        this.equipmentRows.set([]);
      }
      this.equipmentDirty.set(false);
    });
  }

  protected get isFormDirty(): boolean {
    return this.form.dirty || this.equipmentDirty();
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

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.location();
      const equipment: LocationEquipment[] = this.equipmentRows()
        .filter((r) => r.equipmentId)
        .map((r) => ({ equipmentId: r.equipmentId, quantity: r.quantity }));

      if (data) {
        this.locationSaved.emit({ ...this.form.getRawValue(), id: data.id, equipment });
      } else {
        this.locationSaved.emit({ ...this.form.getRawValue(), equipment });
      }
      this.form.reset();
      this.equipmentRows.set([]);
    }
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
