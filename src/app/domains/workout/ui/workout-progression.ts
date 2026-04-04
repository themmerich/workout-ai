import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ChartModule } from 'primeng/chart';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { WorkoutSet } from '../model/workout.model';

interface ProgressionRow {
  date: string;
  sets: WorkoutSet[];
  bestSet: WorkoutSet;
  totalVolume: number;
  totalReps: number;
  maxWeight: number;
}

@Component({
  selector: 'app-workout-progression',
  templateUrl: './workout-progression.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, FormsModule, DecimalPipe, Select, DatePicker, FloatLabel, ChartModule],
  host: { class: 'flex flex-col h-full min-h-0' },
})
export class WorkoutProgressionComponent {
  private readonly exerciseService = inject(ExerciseService);
  private readonly transloco = inject(TranslocoService);

  readonly workoutData = input.required<{ date: string; exerciseId: string; sets: WorkoutSet[] }[]>();

  readonly selectedExerciseId = signal<string | null>(null);
  readonly fromDate = signal<Date>(this.defaultFromDate());

  readonly exerciseOptions = computed(() => {
    const exerciseIds = new Set(this.workoutData().map((d) => d.exerciseId));
    const exercises = [...exerciseIds]
      .map((id) => this.exerciseService.getById(id))
      .filter((e): e is NonNullable<typeof e> => e !== undefined);

    const groupMap = new Map<string, { label: string; value: string }[]>();
    for (const ex of exercises) {
      const group = ex.muscleGroups[0] ?? 'other';
      const groupLabel = this.transloco.translate(`exercise.muscles.${group}`);
      if (!groupMap.has(groupLabel)) {
        groupMap.set(groupLabel, []);
      }
      groupMap.get(groupLabel)!.push({ label: ex.name, value: ex.id });
    }

    return [...groupMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([label, items]) => ({
        label,
        items: items.sort((a, b) => a.label.localeCompare(b.label)),
      }));
  });

  readonly progressionData = computed<ProgressionRow[]>(() => {
    const exId = this.selectedExerciseId();
    if (!exId) return [];

    const from = this.fromDate();
    const fromStr = from ? this.toDateString(from) : '2000-01-01';

    const entries = this.workoutData()
      .filter((d) => d.exerciseId === exId && d.date >= fromStr)
      .sort((a, b) => b.date.localeCompare(a.date));

    return entries.map((entry) => {
      const bestSet = this.findBestSet(entry.sets);
      const totalVolume = entry.sets.reduce((sum, s) => sum + (s.weightKg ?? 0) * s.reps, 0);
      const totalReps = entry.sets.reduce((sum, s) => sum + s.reps, 0);
      const maxWeight = Math.max(0, ...entry.sets.map((s) => s.weightKg ?? 0));
      return { date: entry.date, sets: entry.sets, bestSet, totalVolume, totalReps, maxWeight };
    });
  });

  readonly maxSets = computed(() =>
    this.progressionData().reduce((max, row) => Math.max(max, row.sets.length), 0),
  );

  readonly setRows = computed(() =>
    Array.from({ length: this.maxSets() }, (_, i) => i),
  );

  readonly chartData = computed(() => {
    const rows = [...this.progressionData()].reverse();
    if (rows.length < 2) return null;

    const hasWeight = rows.some((r) => r.maxWeight > 0);

    return {
      labels: rows.map((r) => this.formatDate(r.date)),
      datasets: hasWeight
        ? [
            {
              label: this.transloco.translate('workout.progression.maxWeight'),
              data: rows.map((r) => r.maxWeight),
              fill: true,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.3,
              pointBackgroundColor: '#6366f1',
              yAxisID: 'y',
            },
            {
              label: this.transloco.translate('workout.progression.totalVolume'),
              data: rows.map((r) => r.totalVolume),
              fill: false,
              borderColor: '#22c55e',
              tension: 0.3,
              pointBackgroundColor: '#22c55e',
              borderDash: [5, 5],
              yAxisID: 'y1',
            },
          ]
        : [
            {
              label: this.transloco.translate('workout.progression.totalReps'),
              data: rows.map((r) => r.totalReps),
              fill: true,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              tension: 0.3,
              pointBackgroundColor: '#6366f1',
            },
          ],
    };
  });

  readonly chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 }, padding: 8 },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        position: 'left' as const,
        ticks: { color: '#94a3b8', callback: (value: number) => `${value} kg` },
        grid: { color: 'rgba(148,163,184,0.1)' },
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        ticks: { color: '#94a3b8', callback: (value: number) => `${value} kg` },
        grid: { display: false },
      },
    },
  };

  protected formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  }

  private findBestSet(sets: WorkoutSet[]): WorkoutSet {
    if (sets.some((s) => s.weightKg)) {
      return sets.reduce((best, s) => ((s.weightKg ?? 0) > (best.weightKg ?? 0) ? s : best), sets[0]);
    }
    return sets.reduce((best, s) => (s.reps > best.reps ? s : best), sets[0]);
  }

  private defaultFromDate(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d;
  }

  private toDateString(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
