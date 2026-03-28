import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Toolbar } from 'primeng/toolbar';
import { Tooltip } from 'primeng/tooltip';
import { LocalStorageService } from '../utils/local-storage.service';
import { DataTableTranslations, TableColumn } from './data-table.model';

@Component({
  selector: 'app-data-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  providers: [ConfirmationService, MessageService],
  imports: [
    NgTemplateOutlet,
    FormsModule,
    TranslocoDirective,
    ButtonModule,
    ConfirmDialog,
    IconField,
    InputIcon,
    InputText,
    MultiSelect,
    Select,
    TableModule,
    Toast,
    Toolbar,
    Tooltip,
  ],
  templateUrl: './data-table.html',
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataTableComponent<T extends { id: string } = any> {
  private readonly transloco = inject(TranslocoService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly storage = inject(LocalStorageService);
  private readonly filterService = inject(FilterService);

  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn[]>();
  readonly stateKey = input.required<string>();
  readonly translations = input.required<DataTableTranslations>();
  readonly globalFilterFields = input.required<string[]>();
  readonly nameField = input<string>('name');
  readonly minTableWidth = input('30rem');

  readonly itemAdd = output<void>();
  readonly itemEdit = output<T>();
  readonly itemDelete = output<T>();

  readonly cellTemplate = contentChild<TemplateRef<unknown>>('cell');

  protected readonly dt = viewChild<Table>('dt');
  protected selectedItem: T | null = null;
  protected selectedColumns: TableColumn[] = [];

  protected get allColumns(): TableColumn[] {
    return this.columns();
  }

  constructor() {
    this.filterService.register('arrayIntersect', (value: unknown, filter: unknown): boolean => {
      if (!filter || !Array.isArray(filter) || filter.length === 0) {
        return true;
      }
      if (!value || !Array.isArray(value)) {
        return false;
      }
      return filter.every((f: unknown) => value.includes(f));
    });

    effect(() => {
      const cols = this.columns();
      if (cols.length > 0 && this.selectedColumns.length === 0) {
        this.selectedColumns = this.loadSelectedColumns();
      }
    });
  }

  protected onColumnsChange(columns: TableColumn[]): void {
    this.selectedColumns = columns;
    this.storage.set(this.columnsStorageKey(), columns.map((c) => c.field));
  }

  protected getFilterPlaceholder(headerKey: string): string {
    const field = this.transloco.translate(headerKey);
    return this.transloco.translate(this.translations().filterBy, { field });
  }

  protected onClearFilters(): void {
    const table = this.dt();
    if (table) {
      table.clear();
    }
    this.selectedColumns = [...this.columns()];
    this.storage.remove(this.columnsStorageKey());
    this.storage.remove(`workout-ai-table-${this.stateKey()}`);
  }

  protected onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dt()?.filterGlobal(value, 'contains');
  }

  protected onEdit(item: T): void {
    this.itemEdit.emit(item);
  }

  protected onDelete(item: T): void {
    const t = this.translations();
    const name = String((item as Record<string, unknown>)[this.nameField()] ?? '');
    this.confirmationService.confirm({
      message: this.transloco.translate(t.confirmDelete, { name }),
      header: this.transloco.translate(t.confirmDeleteTitle),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.transloco.translate(t.dialogDelete),
      rejectLabel: this.transloco.translate(t.dialogCancel),
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.itemDelete.emit(item);
      },
    });
  }

  showSuccess(messageKey: string): void {
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate(messageKey),
      life: 3000,
    });
  }

  showError(messageKey: string): void {
    this.messageService.add({
      severity: 'error',
      summary: this.transloco.translate(messageKey),
      life: 5000,
    });
  }

  private columnsStorageKey(): string {
    return `workout-ai-columns-${this.stateKey()}`;
  }

  private loadSelectedColumns(): TableColumn[] {
    const savedFields = this.storage.get<string[]>(this.columnsStorageKey());
    if (savedFields) {
      return this.columns().filter((c) => savedFields.includes(c.field));
    }
    return [...this.columns()];
  }
}
