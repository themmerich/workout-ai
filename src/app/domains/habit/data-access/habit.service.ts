import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { Habit, HabitCategory, HabitEntry } from '../model/habit.model';
import { MOCK_CATEGORIES, MOCK_ENTRIES, MOCK_HABITS } from './habit.mock';

@Injectable({ providedIn: 'root' })
export class HabitService {
  readonly categories = signal<HabitCategory[]>(MOCK_CATEGORIES);
  readonly habits = signal<Habit[]>(MOCK_HABITS);
  readonly entries = signal<HabitEntry[]>(MOCK_ENTRIES);

  // Category CRUD
  getActiveCategories(): HabitCategory[] {
    return this.categories()
      .filter((c) => c.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  addCategory(item: Omit<HabitCategory, 'id'>): void {
    const id = generateId(this.categories());
    this.categories.update((list) => [...list, { ...item, id }]);
  }

  updateCategory(item: HabitCategory): void {
    this.categories.update((list) => list.map((c) => (c.id === item.id ? item : c)));
  }

  deleteCategory(id: string): void {
    this.categories.update((list) => list.filter((c) => c.id !== id));
    this.habits.update((list) => list.filter((h) => h.categoryId !== id));
  }

  // Habit CRUD
  getActiveHabitsByCategory(categoryId: string): Habit[] {
    return this.habits()
      .filter((h) => h.categoryId === categoryId && h.active)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  addHabit(item: Omit<Habit, 'id'>): void {
    const id = generateId(this.habits());
    this.habits.update((list) => [...list, { ...item, id }]);
  }

  updateHabit(item: Habit): void {
    this.habits.update((list) => list.map((h) => (h.id === item.id ? item : h)));
  }

  deleteHabit(id: string): void {
    this.habits.update((list) => list.filter((h) => h.id !== id));
    this.entries.update((list) => list.filter((e) => e.habitId !== id));
  }

  // Entry operations
  getEntriesForDateRange(startDate: string, endDate: string): HabitEntry[] {
    return this.entries().filter((e) => e.date >= startDate && e.date <= endDate);
  }

  upsertEntry(
    habitId: string,
    date: string,
    value: { checkValue?: boolean; numberValue?: number; textValue?: string },
  ): void {
    const existing = this.entries().find((e) => e.habitId === habitId && e.date === date);
    if (existing) {
      this.entries.update((list) =>
        list.map((e) => (e.id === existing.id ? { ...e, ...value } : e)),
      );
    } else {
      const id = generateId(this.entries());
      this.entries.update((list) => [...list, { id, habitId, date, ...value }]);
    }
  }

  // Score calculation
  calculateDayScore(date: string): number {
    const activeHabits = this.habits().filter((h) => h.active);
    const dayEntries = this.entries().filter((e) => e.date === date);

    let score = 0;
    for (const habit of activeHabits) {
      const entry = dayEntries.find((e) => e.habitId === habit.id);
      if (!entry) continue;

      const isFilled =
        (habit.type === 'checkbox' && entry.checkValue === true) ||
        (habit.type === 'number' && entry.numberValue != null) ||
        (habit.type === 'text' && entry.textValue != null && entry.textValue !== '');

      if (isFilled) {
        score += habit.scoreWeight;
      }
    }
    return score;
  }
}
