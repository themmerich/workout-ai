import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { LocalStorageService } from '../../../shared/utils/local-storage.service';
import { LocationService } from '../data-access/location.service';
import { Location } from '../model/location.model';
import { LocationDialogComponent } from '../ui/location-dialog';

const COLUMNS_STORAGE_KEY = 'workout-ai-columns-location';

interface Column {
  field: string;
  headerKey: string;
}

@Component({
  selector: 'app-location-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  providers: [ConfirmationService, MessageService],
  imports: [
    FormsModule,
    TranslocoDirective,
    ButtonModule,
    ConfirmDialog,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    TableModule,
    Toast,
    Toolbar,
    LocationDialogComponent,
  ],
  templateUrl: './location-page.html',
})
export default class LocationPageComponent {
  protected readonly locationService = inject(LocationService);
  private readonly transloco = inject(TranslocoService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly storage = inject(LocalStorageService);
  protected readonly dialogVisible = signal(false);
  protected readonly editingLocation = signal<Location | null>(null);
  protected selectedLocation: Location | null = null;

  private readonly dt = viewChild<Table>('dt');

  protected readonly allColumns: Column[] = [
    { field: 'name', headerKey: 'location.name' },
    { field: 'street', headerKey: 'location.street' },
    { field: 'zip', headerKey: 'location.zip' },
    { field: 'city', headerKey: 'location.city' },
    { field: 'phone', headerKey: 'location.phone' },
    { field: 'email', headerKey: 'location.email' },
    { field: 'website', headerKey: 'location.website' },
  ];

  protected selectedColumns: Column[] = this.loadSelectedColumns();

  protected onColumnsChange(columns: Column[]): void {
    this.selectedColumns = columns;
    this.storage.set(COLUMNS_STORAGE_KEY, columns.map((c) => c.field));
  }

  protected getFilterPlaceholder(headerKey: string): string {
    const field = this.transloco.translate(headerKey);
    return this.transloco.translate('location.filterBy', { field });
  }

  protected onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt()?.filterGlobal(value, 'contains');
  }

  protected onEditLocation(location: Location): void {
    this.editingLocation.set(location);
    this.dialogVisible.set(true);
  }

  protected onSaveLocation(location: Location | Omit<Location, 'id'>): void {
    if ('id' in location) {
      this.locationService.update(location);
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('location.updateSuccess'),
        life: 3000,
      });
    } else {
      this.locationService.add(location);
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('location.createSuccess'),
        life: 3000,
      });
    }
    this.onDialogClosed();
  }

  protected onDeleteLocation(location: Location): void {
    this.confirmationService.confirm({
      message: this.transloco.translate('location.confirmDelete', { name: location.name }),
      header: this.transloco.translate('location.confirmDeleteTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.transloco.translate('location.dialog.delete'),
      rejectLabel: this.transloco.translate('location.dialog.cancel'),
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        try {
          this.locationService.delete(location.id);
          this.messageService.add({
            severity: 'success',
            summary: this.transloco.translate('location.deleteSuccess'),
            life: 3000,
          });
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: this.transloco.translate('location.deleteError'),
            life: 5000,
          });
        }
      },
    });
  }

  protected onDialogClosed(): void {
    this.dialogVisible.set(false);
    this.editingLocation.set(null);
  }

  private loadSelectedColumns(): Column[] {
    const savedFields = this.storage.get<string[]>(COLUMNS_STORAGE_KEY);
    if (savedFields) {
      return this.allColumns.filter((c) => savedFields.includes(c.field));
    }
    return [...this.allColumns];
  }
}
