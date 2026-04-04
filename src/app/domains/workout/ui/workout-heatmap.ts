import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Tooltip } from 'primeng/tooltip';

interface HeatmapDay {
  date: string;
  dayOfWeek: number;
  workoutCount: number;
  visible: boolean;
}

interface HeatmapWeek {
  days: HeatmapDay[];
}

interface MonthLabel {
  colStart: number;
  label: string;
}

interface YearGrid {
  year: number;
  weeks: HeatmapWeek[];
  monthLabels: MonthLabel[];
}

@Component({
  selector: 'app-workout-heatmap',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, Tooltip],
  templateUrl: './workout-heatmap.html',
  host: {
    '(window:resize)': 'onResize()',
  },
})
export class WorkoutHeatmapComponent {
  private readonly transloco = inject(TranslocoService);

  readonly workoutDates = input.required<string[]>();

  private readonly isSmallScreen = signal(typeof window !== 'undefined' && window.innerWidth < 640);

  protected readonly cellSize = computed(() => this.isSmallScreen() ? '10px' : '14px');
  protected readonly cellStep = computed(() => this.isSmallScreen() ? 12 : 16);
  protected readonly dayLabelWidth = computed(() => this.isSmallScreen() ? '20px' : '28px');

  protected onResize(): void {
    this.isSmallScreen.set(window.innerWidth < 640);
  }

  private readonly monthNames = computed(() => {
    return this.transloco.getActiveLang() === 'de'
      ? ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  });

  protected readonly visibleDayLabels = computed(() => {
    const labels = this.transloco.getActiveLang() === 'de'
      ? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return [
      { row: 0, label: labels[0] },
      { row: 2, label: labels[2] },
      { row: 4, label: labels[4] },
    ];
  });

  protected readonly yearGrids = computed<YearGrid[]>(() => {
    const dateCountMap = new Map<string, number>();
    for (const d of this.workoutDates()) {
      dateCountMap.set(d, (dateCountMap.get(d) ?? 0) + 1);
    }

    const currentYear = new Date().getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [currentYear, currentYear - 1, currentYear - 2].map((year) =>
      this.buildYearGrid(year, dateCountMap, today),
    );
  });

  protected getCellClass(day: HeatmapDay): string {
    if (!day.visible) return 'invisible';
    if (day.workoutCount === 0) return 'bg-surface-200 dark:bg-surface-700';
    if (day.workoutCount === 1) return 'bg-green-400 dark:bg-green-500';
    return 'bg-green-600 dark:bg-green-400';
  }

  protected getTooltip(day: HeatmapDay): string {
    const formattedDate = this.formatDate(day.date);
    if (day.workoutCount === 0) {
      return `${this.transloco.translate('workout.noWorkout')} — ${formattedDate}`;
    }
    return this.transloco.translate('workout.calendarTooltip', {
      count: day.workoutCount,
      date: formattedDate,
    });
  }

  private buildYearGrid(year: number, dateCountMap: Map<string, number>, today: Date): YearGrid {
    const startDate = new Date(year, 0, 1);
    const startDay = startDate.getDay();
    const daysToMonday = startDay === 0 ? 6 : startDay - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);

    const endDate = new Date(year, 11, 31);

    const weeks: HeatmapWeek[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const week: HeatmapDay[] = [];
      for (let d = 0; d < 7; d++) {
        const dateStr = this.toDateString(current);
        const currentYear = current.getFullYear();
        const isFuture = year === today.getFullYear() && current > today;
        const isOutsideYear = currentYear !== year;
        week.push({
          date: dateStr,
          dayOfWeek: d,
          workoutCount: dateCountMap.get(dateStr) ?? 0,
          visible: !isFuture && !isOutsideYear,
        });
        current.setDate(current.getDate() + 1);
      }
      weeks.push({ days: week });
    }

    const names = this.monthNames();
    const monthLabels: MonthLabel[] = [];
    let lastMonth = -1;
    for (let i = 0; i < weeks.length; i++) {
      const firstVisible = weeks[i].days.find((d) => d.visible);
      if (!firstVisible) continue;
      const month = parseInt(firstVisible.date.substring(5, 7), 10) - 1;
      if (month !== lastMonth) {
        monthLabels.push({ colStart: i, label: names[month] });
        lastMonth = month;
      }
    }

    return { year, weeks, monthLabels };
  }

  private formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  }

  private toDateString(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
