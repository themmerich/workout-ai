import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { LocationService } from '../data-access/location.service';
import { Location } from '../model/location.model';
import { LocationDialogComponent } from '../ui/location-dialog';

@Component({
  selector: 'app-location-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, DataTableComponent, LocationDialogComponent],
  templateUrl: './location-page.html',
})
export default class LocationPageComponent {
  protected readonly locationService = inject(LocationService);
  protected readonly dialogVisible = signal(false);
  protected readonly editingLocation = signal<Location | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<Location>>('dataTable');

  protected readonly columns: TableColumn[] = [
    { field: 'name', headerKey: 'location.name' },
    { field: 'street', headerKey: 'location.street' },
    { field: 'zip', headerKey: 'location.zip' },
    { field: 'city', headerKey: 'location.city' },
    { field: 'phone', headerKey: 'location.phone' },
    { field: 'email', headerKey: 'location.email' },
    { field: 'website', headerKey: 'location.website' },
  ];

  protected readonly globalFilterFields = ['name', 'street', 'zip', 'city', 'country', 'phone', 'email', 'website'];

  protected readonly translations: DataTableTranslations = {
    columns: 'location.columns',
    columnsSelected: 'location.columnsSelected',
    search: 'location.search',
    addButton: 'location.addLocation',
    actions: 'location.actions',
    edit: 'location.edit',
    delete: 'location.delete',
    filterBy: 'location.filterBy',
    confirmDeleteTitle: 'location.confirmDeleteTitle',
    confirmDelete: 'location.confirmDelete',
    createSuccess: 'location.createSuccess',
    updateSuccess: 'location.updateSuccess',
    deleteSuccess: 'location.deleteSuccess',
    deleteError: 'location.deleteError',
    dialogDelete: 'location.dialog.delete',
    dialogCancel: 'location.dialog.cancel',
  };

  protected onAdd(): void {
    this.editingLocation.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(location: Location): void {
    this.editingLocation.set(location);
    this.dialogVisible.set(true);
  }

  protected onSaveLocation(location: Location | Omit<Location, 'id'>): void {
    if ('id' in location && location.id) {
      this.locationService.update(location as Location);
      this.dataTable()?.showSuccess(this.translations.updateSuccess);
    } else {
      this.locationService.add(location as Omit<Location, 'id'>);
      this.dataTable()?.showSuccess(this.translations.createSuccess);
    }
    this.dialogVisible.set(false);
    this.editingLocation.set(null);
  }

  protected onDelete(location: Location): void {
    try {
      this.locationService.delete(location.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
