import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { HabitService } from '../data-access/habit.service';
import { Habit, HabitType } from '../model/habit.model';

@Component({
  selector: 'app-habit-management-dialog',
  templateUrl: './habit-management-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    FormsModule,
    Dialog,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button,
    InputText,
    InputNumber,
    Select,
    ToggleSwitch,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
})
export class HabitManagementDialogComponent {
  readonly visible = input.required<boolean>();
  readonly dialogClosed = output<void>();

  private readonly habitService = inject(HabitService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  readonly selectedCategoryId = signal<string | null>(null);

  readonly typeOptions: { label: string; value: HabitType }[] = [
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Zahl', value: 'number' },
    { label: 'Text', value: 'text' },
  ];

  readonly editableCategories = computed(() =>
    [...this.habitService.categories()].sort((a, b) => a.sortOrder - b.sortOrder),
  );

  readonly categoryOptions = computed(() =>
    this.habitService.categories().sort((a, b) => a.sortOrder - b.sortOrder),
  );

  readonly editableHabits = computed(() => {
    const catId = this.selectedCategoryId();
    if (!catId) return [];
    return this.habitService
      .habits()
      .filter((h) => h.categoryId === catId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  });

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.dialogClosed.emit();
    }
  }

  // Category operations
  onCategoryNameChange(category: { id: string }, event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    const full = this.habitService.categories().find((c) => c.id === category.id);
    if (full && name) {
      this.habitService.updateCategory({ ...full, name });
    }
  }

  onCategoryActiveChange(category: { id: string }, active: boolean): void {
    const full = this.habitService.categories().find((c) => c.id === category.id);
    if (full) {
      this.habitService.updateCategory({ ...full, active });
    }
  }

  moveCategoryUp(category: { id: string; sortOrder: number }): void {
    const cats = this.editableCategories();
    const idx = cats.findIndex((c) => c.id === category.id);
    if (idx > 0) {
      this.habitService.updateCategory({ ...cats[idx], sortOrder: cats[idx - 1].sortOrder });
      this.habitService.updateCategory({ ...cats[idx - 1], sortOrder: category.sortOrder });
    }
  }

  moveCategoryDown(category: { id: string; sortOrder: number }): void {
    const cats = this.editableCategories();
    const idx = cats.findIndex((c) => c.id === category.id);
    if (idx < cats.length - 1) {
      this.habitService.updateCategory({ ...cats[idx], sortOrder: cats[idx + 1].sortOrder });
      this.habitService.updateCategory({ ...cats[idx + 1], sortOrder: category.sortOrder });
    }
  }

  onAddCategory(): void {
    const maxSort = Math.max(0, ...this.habitService.categories().map((c) => c.sortOrder));
    this.habitService.addCategory({
      name: this.transloco.translate('habit.management.newCategory'),
      sortOrder: maxSort + 1,
      active: true,
    });
  }

  onDeleteCategory(event: Event, category: { id: string; name: string }): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.transloco.translate('habit.management.confirmDeleteTitle'),
      message: this.transloco.translate('habit.management.confirmDeleteCategory'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.transloco.translate('habit.management.delete'),
      rejectLabel: this.transloco.translate('habit.management.cancel'),
      accept: () => this.habitService.deleteCategory(category.id),
    });
  }

  // Habit operations
  onHabitNameChange(habit: Habit, event: Event): void {
    const name = (event.target as HTMLInputElement).value;
    if (name) {
      this.habitService.updateHabit({ ...habit, name });
    }
  }

  onHabitActiveChange(habit: Habit, active: boolean): void {
    this.habitService.updateHabit({ ...habit, active });
  }

  onHabitTypeChange(habit: Habit, type: HabitType): void {
    this.habitService.updateHabit({ ...habit, type, unit: type === 'number' ? habit.unit : undefined });
  }

  onHabitUnitChange(habit: Habit, event: Event): void {
    const unit = (event.target as HTMLInputElement).value || undefined;
    this.habitService.updateHabit({ ...habit, unit });
  }

  onHabitScoreWeightChange(habit: Habit, scoreWeight: number | null): void {
    if (scoreWeight != null && scoreWeight >= 1 && scoreWeight !== habit.scoreWeight) {
      this.habitService.updateHabit({ ...habit, scoreWeight });
    }
  }

  moveHabitUp(habit: Habit): void {
    const habits = this.editableHabits();
    const idx = habits.findIndex((h) => h.id === habit.id);
    if (idx > 0) {
      this.habitService.updateHabit({ ...habits[idx], sortOrder: habits[idx - 1].sortOrder });
      this.habitService.updateHabit({ ...habits[idx - 1], sortOrder: habit.sortOrder });
    }
  }

  moveHabitDown(habit: Habit): void {
    const habits = this.editableHabits();
    const idx = habits.findIndex((h) => h.id === habit.id);
    if (idx < habits.length - 1) {
      this.habitService.updateHabit({ ...habits[idx], sortOrder: habits[idx + 1].sortOrder });
      this.habitService.updateHabit({ ...habits[idx + 1], sortOrder: habit.sortOrder });
    }
  }

  onAddHabit(): void {
    const catId = this.selectedCategoryId();
    if (!catId) return;
    const habitsInCat = this.habitService.habits().filter((h) => h.categoryId === catId);
    const maxSort = Math.max(0, ...habitsInCat.map((h) => h.sortOrder));
    this.habitService.addHabit({
      name: this.transloco.translate('habit.management.newHabit'),
      categoryId: catId,
      type: 'checkbox',
      scoreWeight: 1,
      sortOrder: maxSort + 1,
      active: true,
    });
  }

  onDeleteHabit(event: Event, habit: Habit): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.transloco.translate('habit.management.confirmDeleteTitle'),
      message: this.transloco.translate('habit.management.confirmDeleteHabit'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.transloco.translate('habit.management.delete'),
      rejectLabel: this.transloco.translate('habit.management.cancel'),
      accept: () => this.habitService.deleteHabit(habit.id),
    });
  }
}
