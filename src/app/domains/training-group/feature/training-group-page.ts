import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tag } from 'primeng/tag';
import { DataTableComponent } from '../../../shared/ui/data-table';
import { DataTableTranslations, TableColumn } from '../../../shared/ui/data-table.model';
import { AuthService } from '../../../core/auth/auth.service';
import { LocationLogoComponent } from '../../location/ui/location-logo';
import { TrainingGroupService } from '../data-access/training-group.service';
import { TrainingGroup } from '../model/training-group.model';
import { TrainingGroupDialogComponent } from '../ui/training-group-dialog';

@Component({
  selector: 'app-training-group-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [TranslocoDirective, Tag, DataTableComponent, LocationLogoComponent, TrainingGroupDialogComponent],
  templateUrl: './training-group-page.html',
})
export default class TrainingGroupPageComponent {
  private readonly authService = inject(AuthService);
  private readonly groupService = inject(TrainingGroupService);
  private readonly transloco = inject(TranslocoService);

  protected readonly dialogVisible = signal(false);
  protected readonly editingGroup = signal<TrainingGroup | null>(null);

  private readonly dataTable = viewChild<DataTableComponent<TrainingGroup>>('dataTable');

  protected readonly userGroups = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.groupService.getByUserId(user.id);
  });

  protected readonly columns = computed<TableColumn[]>(() => [
    { field: 'name', headerKey: 'trainingGroup.name' },
    { field: 'members', headerKey: 'trainingGroup.members' },
    { field: 'role', headerKey: 'trainingGroup.role' },
  ]);

  protected readonly globalFilterFields = ['name'];

  protected readonly translations: DataTableTranslations = {
    columns: 'trainingGroup.columns',
    columnsSelected: 'trainingGroup.columnsSelected',
    search: 'trainingGroup.search',
    addButton: 'trainingGroup.addGroup',
    actions: 'trainingGroup.actions',
    edit: 'trainingGroup.edit',
    delete: 'trainingGroup.delete',
    filterBy: 'trainingGroup.filterBy',
    confirmDeleteTitle: 'trainingGroup.confirmDeleteTitle',
    confirmDelete: 'trainingGroup.confirmDelete',
    createSuccess: 'trainingGroup.createSuccess',
    updateSuccess: 'trainingGroup.updateSuccess',
    deleteSuccess: 'trainingGroup.deleteSuccess',
    deleteError: 'trainingGroup.deleteError',
    dialogDelete: 'trainingGroup.dialog.delete',
    dialogCancel: 'trainingGroup.dialog.cancel',
    clearFilters: 'trainingGroup.clearFilters',
  };

  protected getUserRole(group: TrainingGroup): string {
    const user = this.authService.currentUser();
    const member = group.members.find((m) => m.userId === user?.id);
    return member?.role ?? '';
  }

  protected onAdd(): void {
    this.editingGroup.set(null);
    this.dialogVisible.set(true);
  }

  protected onEdit(item: TrainingGroup): void {
    this.editingGroup.set(item);
    this.dialogVisible.set(true);
  }

  protected onSaveGroup(item: TrainingGroup | Omit<TrainingGroup, 'id'>): void {
    if ('id' in item && item.id) {
      this.groupService.update(item as TrainingGroup);
      this.dataTable()?.showSuccess(this.translations.updateSuccess);
    } else {
      this.groupService.add(item as Omit<TrainingGroup, 'id'>);
      this.dataTable()?.showSuccess(this.translations.createSuccess);
    }
    this.dialogVisible.set(false);
    this.editingGroup.set(null);
  }

  protected onDelete(item: TrainingGroup): void {
    try {
      this.groupService.delete(item.id);
      this.dataTable()?.showSuccess(this.translations.deleteSuccess);
    } catch {
      this.dataTable()?.showError(this.translations.deleteError);
    }
  }
}
