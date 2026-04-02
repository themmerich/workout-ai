import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { ExerciseService } from '../data-access/exercise.service';
import { ExerciseComboService } from '../data-access/exercise-combo.service';
import { COMBO_TYPES, ExerciseCombo } from '../model/exercise-combo.model';
import { ExerciseComboDialogComponent } from '../ui/exercise-combo-dialog';

@Component({
  selector: 'app-exercise-combo-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, Tag, DataTableComponent, ExerciseComboDialogComponent],
  templateUrl: './exercise-combo-page.html',
})
export default class ExerciseComboPageComponent {
  protected readonly comboService = inject(ExerciseComboService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly transloco = inject(TranslocoService);
  protected readonly dialogVisible = signal(false);
  protected readonly editingCombo = signal<ExerciseCombo | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<ExerciseCombo>>('dataTable');

  protected readonly comboTypeFilterOptions = computed(() =>
    COMBO_TYPES.map((t) => ({
      label: this.transloco.translate('exerciseCombo.types.' + t),
      value: t,
    })),
  );

  protected readonly columns = computed<TableColumn[]>(() => [
    { field: 'name', headerKey: 'exerciseCombo.name' },
    {
      field: 'type',
      headerKey: 'exerciseCombo.type',
      filterMode: 'select',
      filterPlaceholderKey: 'exerciseCombo.filterByType',
      filterOptions: this.comboTypeFilterOptions(),
    },
    {
      field: 'exercises',
      headerKey: 'exerciseCombo.exercises',
    },
  ]);

  protected readonly globalFilterFields = ['name', 'type'];

  protected readonly translations: DataTableTranslations = {
    columns: 'exerciseCombo.columns',
    columnsSelected: 'exerciseCombo.columnsSelected',
    search: 'exerciseCombo.search',
    addButton: 'exerciseCombo.addCombo',
    actions: 'exerciseCombo.actions',
    edit: 'exerciseCombo.edit',
    delete: 'exerciseCombo.delete',
    filterBy: 'exerciseCombo.filterBy',
    confirmDeleteTitle: 'exerciseCombo.confirmDeleteTitle',
    confirmDelete: 'exerciseCombo.confirmDelete',
    createSuccess: 'exerciseCombo.createSuccess',
    updateSuccess: 'exerciseCombo.updateSuccess',
    deleteSuccess: 'exerciseCombo.deleteSuccess',
    deleteError: 'exerciseCombo.deleteError',
    dialogDelete: 'exerciseCombo.dialog.delete',
    dialogCancel: 'exerciseCombo.dialog.cancel',
    clearFilters: 'exerciseCombo.clearFilters',
  };

  protected getExerciseName(id: string): string {
    return this.exerciseService.getById(id)?.name ?? id;
  }

  protected getExerciseSummary(combo: ExerciseCombo): string {
    return [...combo.exercises]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((ex) => {
        const name = this.getExerciseName(ex.exerciseId);
        const weight = ex.weightKg ? ` (${ex.weightKg} kg)` : '';
        return `${ex.reps}x ${name}${weight}`;
      })
      .join(', ');
  }

  protected onAdd(): void {
    this.editingCombo.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(item: ExerciseCombo): void {
    this.editingCombo.set(item);
    this.dialogVisible.set(true);
  }

  protected onSaveCombo(item: ExerciseCombo | Omit<ExerciseCombo, 'id'>): void {
    if ('id' in item && item.id) {
      this.comboService.update(item as ExerciseCombo);
      this.dataTable()?.showSuccess(this.translations.updateSuccess);
    } else {
      this.comboService.add(item as Omit<ExerciseCombo, 'id'>);
      this.dataTable()?.showSuccess(this.translations.createSuccess);
    }
    this.dialogVisible.set(false);
    this.editingCombo.set(null);
  }

  protected onDelete(item: ExerciseCombo): void {
    try {
      this.comboService.delete(item.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
