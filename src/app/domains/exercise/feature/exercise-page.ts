import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { EquipmentService } from '../../equipment/data-access/equipment.service';
import { ExerciseService } from '../data-access/exercise.service';
import { Exercise, MUSCLE_GROUPS } from '../model/exercise.model';
import { ExerciseDialogComponent } from '../ui/exercise-dialog';

@Component({
  selector: 'app-exercise-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, Tag, DataTableComponent, ExerciseDialogComponent],
  templateUrl: './exercise-page.html',
})
export default class ExercisePageComponent {
  protected readonly exerciseService = inject(ExerciseService);
  protected readonly equipmentService = inject(EquipmentService);
  private readonly transloco = inject(TranslocoService);
  protected readonly dialogVisible = signal(false);
  protected readonly editingExercise = signal<Exercise | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<Exercise>>('dataTable');

  protected readonly muscleGroupFilterOptions = computed(() =>
    MUSCLE_GROUPS.map((mg) => ({
      label: this.transloco.translate('exercise.muscles.' + mg),
      value: mg,
    })),
  );

  protected readonly equipmentFilterOptions = computed(() =>
    this.equipmentService.equipment().map((e) => ({
      label: e.name,
      value: e.id,
    })),
  );

  protected readonly columns = computed<TableColumn[]>(() => [
    { field: 'name', headerKey: 'exercise.name' },
    {
      field: 'muscleGroups',
      headerKey: 'exercise.muscleGroups',
      filterMode: 'multiselect',
      filterPlaceholderKey: 'exercise.filterByMuscleGroup',
      filterSelectedItemsLabelKey: 'exercise.filterMusclesSelected',
      filterOptions: this.muscleGroupFilterOptions(),
    },
    {
      field: 'equipmentIds',
      headerKey: 'exercise.equipment',
      filterMode: 'multiselect',
      filterPlaceholderKey: 'exercise.filterByEquipment',
      filterSelectedItemsLabelKey: 'exercise.filterEquipmentSelected',
      filterOptions: this.equipmentFilterOptions(),
    },
  ]);

  protected readonly globalFilterFields = ['name', 'muscleGroups', 'equipmentIds'];

  protected readonly translations: DataTableTranslations = {
    columns: 'exercise.columns',
    columnsSelected: 'exercise.columnsSelected',
    search: 'exercise.search',
    addButton: 'exercise.addExercise',
    actions: 'exercise.actions',
    edit: 'exercise.edit',
    delete: 'exercise.delete',
    filterBy: 'exercise.filterBy',
    confirmDeleteTitle: 'exercise.confirmDeleteTitle',
    confirmDelete: 'exercise.confirmDelete',
    createSuccess: 'exercise.createSuccess',
    updateSuccess: 'exercise.updateSuccess',
    deleteSuccess: 'exercise.deleteSuccess',
    deleteError: 'exercise.deleteError',
    dialogDelete: 'exercise.dialog.delete',
    dialogCancel: 'exercise.dialog.cancel',
    clearFilters: 'exercise.clearFilters',
  };

  protected getEquipmentName(id: string): string {
    return this.equipmentService.getById(id)?.name ?? id;
  }

  protected onAdd(): void {
    this.editingExercise.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(item: Exercise): void {
    this.editingExercise.set(item);
    this.dialogVisible.set(true);
  }

  protected onSaveExercise(item: Exercise | Omit<Exercise, 'id'>): void {
    if ('id' in item && item.id) {
      this.exerciseService.update(item as Exercise);
      this.dataTable()?.showSuccess(this.translations.updateSuccess);
    } else {
      this.exerciseService.add(item as Omit<Exercise, 'id'>);
      this.dataTable()?.showSuccess(this.translations.createSuccess);
    }
    this.dialogVisible.set(false);
    this.editingExercise.set(null);
  }

  protected onDelete(item: Exercise): void {
    try {
      this.exerciseService.delete(item.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
