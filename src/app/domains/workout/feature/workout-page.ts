import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, RowGroupConfig, TableColumn } from '../../../shared/ui/data-table.model';
import { AuthService } from '../../../core/auth/auth.service';
import { LocationService } from '../../location/data-access/location.service';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { ExerciseComboService } from '../../exercise/data-access/exercise-combo.service';
import { WorkoutService } from '../data-access/workout.service';
import { Workout } from '../model/workout.model';
import { WorkoutDialogComponent } from '../ui/workout-dialog';

@Component({
  selector: 'app-workout-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, Tag, DataTableComponent, WorkoutDialogComponent],
  templateUrl: './workout-page.html',
})
export default class WorkoutPageComponent {
  private readonly authService = inject(AuthService);
  private readonly workoutService = inject(WorkoutService);
  private readonly locationService = inject(LocationService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly comboService = inject(ExerciseComboService);
  private readonly transloco = inject(TranslocoService);

  protected readonly dialogVisible = signal(false);
  protected readonly editingWorkout = signal<Workout | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<Workout>>('dataTable');

  private readonly MONTH_NAMES_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  private readonly MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  protected readonly userWorkouts = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.workoutService
      .getByUserId(user.id)
      .map((w) => ({ ...w, month: w.date.substring(0, 7) }))
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  protected readonly rowGroupConfig: RowGroupConfig = {
    groupBy: 'month',
    sortOrder: -1,
    labelFn: (value: string) => {
      const [year, month] = value.split('-');
      const monthNames = this.transloco.getActiveLang() === 'de' ? this.MONTH_NAMES_DE : this.MONTH_NAMES_EN;
      return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
    },
  };

  protected readonly columns = computed<TableColumn[]>(() => [
    { field: 'date', headerKey: 'workout.date' },
    { field: 'time', headerKey: 'workout.time' },
    { field: 'durationMinutes', headerKey: 'workout.duration' },
    { field: 'locationId', headerKey: 'workout.location' },
    { field: 'description', headerKey: 'workout.description' },
    { field: 'exercises', headerKey: 'workout.exercises' },
  ]);

  protected readonly globalFilterFields = ['date', 'time', 'description'];

  protected readonly translations: DataTableTranslations = {
    columns: 'workout.columns',
    columnsSelected: 'workout.columnsSelected',
    search: 'workout.search',
    addButton: 'workout.addWorkout',
    actions: 'workout.actions',
    edit: 'workout.edit',
    delete: 'workout.delete',
    filterBy: 'workout.filterBy',
    confirmDeleteTitle: 'workout.confirmDeleteTitle',
    confirmDelete: 'workout.confirmDelete',
    createSuccess: 'workout.createSuccess',
    updateSuccess: 'workout.updateSuccess',
    deleteSuccess: 'workout.deleteSuccess',
    deleteError: 'workout.deleteError',
    dialogDelete: 'workout.dialog.delete',
    dialogCancel: 'workout.dialog.cancel',
    clearFilters: 'workout.clearFilters',
  };

  protected getLocationName(locationId: string | null): string {
    if (!locationId) return this.transloco.translate('workout.outdoor');
    return this.locationService.getById(locationId)?.name ?? locationId;
  }

  protected getExerciseSummary(workout: Workout): string {
    return workout.exercises
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((entry) => {
        if (entry.exerciseId) {
          return this.exerciseService.getById(entry.exerciseId)?.name ?? entry.exerciseId;
        }
        if (entry.exerciseComboId) {
          return this.comboService.getById(entry.exerciseComboId)?.name ?? entry.exerciseComboId;
        }
        return '?';
      })
      .join(', ');
  }

  protected formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  }

  protected onEdit(item: Workout): void {
    this.editingWorkout.set(item);
    this.dialogVisible.set(true);
  }

  protected onSaveWorkout(item: Workout | Omit<Workout, 'id'>): void {
    if ('id' in item && item.id) {
      this.workoutService.update(item as Workout);
      this.dataTable()?.showSuccess(this.translations.updateSuccess);
    } else {
      this.workoutService.add(item as Omit<Workout, 'id'>);
      this.dataTable()?.showSuccess(this.translations.createSuccess);
    }
    this.dialogVisible.set(false);
    this.editingWorkout.set(null);
  }

  protected onDelete(item: Workout): void {
    try {
      this.workoutService.delete(item.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
