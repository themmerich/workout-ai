import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { HabitService } from '../data-access/habit.service';
import { HabitEntry } from '../model/habit.model';
import { HabitManagementDialogComponent } from '../ui/habit-management-dialog';
import { EntryChange, HabitWeekGridComponent } from '../ui/habit-week-grid';

@Component({
  selector: 'app-habit-page',
  templateUrl: './habit-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, Button, HabitWeekGridComponent, HabitManagementDialogComponent],
  host: { class: 'flex flex-col h-full min-h-0' },
})
export default class HabitPageComponent {
  private readonly habitService = inject(HabitService);

  readonly managementDialogVisible = signal(false);
  readonly collapsedCategories = signal(new Set<string>());

  // Week navigation
  readonly currentWeekStart = signal(this.getMonday(new Date()));

  readonly weekDays = computed(() => {
    const start = this.currentWeekStart();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  });

  readonly weekLabel = computed(() => {
    const days = this.weekDays();
    const start = this.formatDate(days[0]);
    const end = this.formatDate(days[6]);
    return `${start} – ${end}`;
  });

  // Data
  readonly activeCategories = computed(() => this.habitService.getActiveCategories());

  readonly habitsByCategoryMap = computed(() => {
    const cats = this.activeCategories();
    const map = new Map<string, ReturnType<typeof this.habitService.getActiveHabitsByCategory>>();
    for (const cat of cats) {
      map.set(cat.id, this.habitService.getActiveHabitsByCategory(cat.id));
    }
    return map;
  });

  readonly weekEntries = computed(() => {
    const days = this.weekDays();
    return this.habitService.getEntriesForDateRange(days[0], days[6]);
  });

  readonly entryMap = computed(() => {
    const map = new Map<string, HabitEntry>();
    for (const entry of this.weekEntries()) {
      map.set(`${entry.habitId}_${entry.date}`, entry);
    }
    return map;
  });

  readonly dayScores = computed(() => {
    const map = new Map<string, number>();
    for (const day of this.weekDays()) {
      map.set(day, this.habitService.calculateDayScore(day));
    }
    return map;
  });

  // Navigation
  previousWeek(): void {
    const d = new Date(this.currentWeekStart());
    d.setDate(d.getDate() - 7);
    this.currentWeekStart.set(d.toISOString().slice(0, 10));
  }

  nextWeek(): void {
    const d = new Date(this.currentWeekStart());
    d.setDate(d.getDate() + 7);
    this.currentWeekStart.set(d.toISOString().slice(0, 10));
  }

  goToToday(): void {
    this.currentWeekStart.set(this.getMonday(new Date()));
  }

  // Entry handling
  onEntryChanged(change: EntryChange): void {
    this.habitService.upsertEntry(change.habitId, change.date, change.value);
  }

  toggleCategory(categoryId: string): void {
    this.collapsedCategories.update((set) => {
      const next = new Set(set);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  // Helpers
  private getMonday(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  }

  private formatDate(isoDate: string): string {
    const d = new Date(isoDate + 'T00:00:00');
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.`;
  }
}
