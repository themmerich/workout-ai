import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { Checkbox } from 'primeng/checkbox';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Habit, HabitCategory, HabitEntry } from '../model/habit.model';

export interface EntryChange {
  habitId: string;
  date: string;
  value: { checkValue?: boolean; numberValue?: number; textValue?: string };
}

@Component({
  selector: 'app-habit-week-grid',
  templateUrl: './habit-week-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, FormsModule, Checkbox, InputNumber, InputText],
  host: { class: 'flex flex-col flex-1 min-h-0' },
})
export class HabitWeekGridComponent {
  readonly weekDays = input.required<string[]>();
  readonly categories = input.required<HabitCategory[]>();
  readonly habitsByCategory = input.required<Map<string, Habit[]>>();
  readonly entryMap = input.required<Map<string, HabitEntry>>();
  readonly dayScores = input.required<Map<string, number>>();
  readonly collapsedCategories = input.required<Set<string>>();

  readonly entryChanged = output<EntryChange>();
  readonly categoryToggled = output<string>();

  private readonly today = new Date().toISOString().slice(0, 10);
  private readonly dayLabels = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

  private readonly transloco = inject(TranslocoDirective, { optional: true });

  isToday(date: string): boolean {
    return date === this.today;
  }

  getDayLabel(date: string): string {
    const d = new Date(date + 'T00:00:00');
    return this.dayLabels[d.getDay()];
  }

  getDateLabel(date: string): string {
    const d = new Date(date + 'T00:00:00');
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.`;
  }

  isCategoryCollapsed(categoryId: string): boolean {
    return this.collapsedCategories().has(categoryId);
  }

  getHabitsForCategory(categoryId: string): Habit[] {
    return this.habitsByCategory().get(categoryId) ?? [];
  }

  private getEntry(habitId: string, date: string): HabitEntry | undefined {
    return this.entryMap().get(`${habitId}_${date}`);
  }

  getCheckValue(habitId: string, date: string): boolean {
    return this.getEntry(habitId, date)?.checkValue ?? false;
  }

  getNumberValue(habitId: string, date: string): number | null {
    return this.getEntry(habitId, date)?.numberValue ?? null;
  }

  getTextValue(habitId: string, date: string): string {
    return this.getEntry(habitId, date)?.textValue ?? '';
  }

  onCheckChange(habitId: string, date: string, value: boolean): void {
    this.entryChanged.emit({ habitId, date, value: { checkValue: value } });
  }

  onNumberBlur(habitId: string, date: string, event: Event): void {
    const inputEl = (event.target as HTMLElement).querySelector('input') ?? (event.target as HTMLInputElement);
    const raw = inputEl?.value?.replace(/\./g, '').replace(',', '.');
    const num = raw ? parseFloat(raw) : undefined;
    this.entryChanged.emit({
      habitId,
      date,
      value: { numberValue: num != null && !isNaN(num) ? num : undefined },
    });
  }

  onTextBlur(habitId: string, date: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.entryChanged.emit({ habitId, date, value: { textValue: value || undefined } });
  }
}
