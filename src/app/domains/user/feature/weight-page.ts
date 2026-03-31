import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { AuthService } from '../../../core/auth/auth.service';
import { UserService } from '../data-access/user.service';
import { UserProfile } from '../model/user.model';

@Component({
  selector: 'app-weight-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  providers: [MessageService],
  imports: [
    FormsModule,
    TranslocoDirective,
    ButtonModule,
    ChartModule,
    DatePicker,
    FloatLabel,
    InputNumber,
    Toast,
    Tooltip,
  ],
  templateUrl: './weight-page.html',
})
export default class WeightPageComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  protected readonly userProfile = computed<UserProfile | undefined>(() => {
    const user = this.authService.currentUser();
    return user ? this.userService.getById(user.id) : undefined;
  });

  protected readonly weightDate = signal<Date>(new Date());
  protected readonly weightKg = signal<number | null>(null);
  protected readonly hasExistingWeight = signal(false);

  protected readonly weightHistory = signal<{ date: string; weightKg: number }[]>([]);

  protected readonly compareDate = signal<Date | null>(null);

  protected readonly weightDifference = computed(() => {
    const latest = this.latestWeight();
    const compDate = this.compareDate();
    if (!latest || !compDate) return null;

    const compDateStr = this.toDateString(compDate);
    const history = this.weightHistory();
    const exact = history.find((e) => e.date === compDateStr);
    if (exact) {
      return Math.round((latest.weightKg - exact.weightKg) * 100) / 100;
    }

    const beforeOrEqual = history
      .filter((e) => e.date <= compDateStr)
      .sort((a, b) => b.date.localeCompare(a.date));
    if (beforeOrEqual.length > 0) {
      return Math.round((latest.weightKg - beforeOrEqual[0].weightKg) * 100) / 100;
    }

    return undefined;
  });

  protected readonly latestWeight = computed(() => {
    const history = this.weightHistory();
    return history.length > 0 ? history[0] : null;
  });

  protected readonly bmi = computed(() => {
    const weight = this.latestWeight();
    const profile = this.userProfile();
    if (!weight || !profile?.heightCm) return null;
    const heightM = profile.heightCm / 100;
    return Math.round((weight.weightKg / (heightM * heightM)) * 10) / 10;
  });

  protected readonly bmiCategory = computed(() => {
    const value = this.bmi();
    if (value == null) return null;
    if (value < 17.5) return { key: 'underweight', color: 'text-blue-500' };
    if (value < 18.5) return { key: 'slightlyUnderweight', color: 'text-blue-500' };
    if (value < 25) return { key: 'normal', color: 'text-green-500' };
    if (value < 26) return { key: 'slightlyOverweight', color: 'text-orange-500' };
    if (value < 30) return { key: 'overweight', color: 'text-orange-500' };
    if (value < 31) return { key: 'slightlyObese', color: 'text-red-500' };
    return { key: 'obese', color: 'text-red-500' };
  });

  protected readonly bmiTooltip = computed(() => {
    return this.transloco.translate('profile.bmiTooltip');
  });

  protected readonly weightChartData = computed(() => {
    const history = [...this.weightHistory()].sort((a, b) => a.date.localeCompare(b.date));
    return {
      labels: history.map((e) => this.formatDate(e.date)),
      datasets: [
        {
          label: this.transloco.translate('profile.weightKg'),
          data: history.map((e) => e.weightKg),
          fill: true,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.3,
          pointBackgroundColor: '#6366f1',
        },
      ],
    };
  });

  protected readonly weightChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { callback: (value: number) => `${value} kg` },
      },
    },
  };

  constructor() {
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.refreshWeightHistory(profile);
        if (profile.weightCompareDate && !this.compareDate()) {
          this.compareDate.set(new Date(profile.weightCompareDate));
        }
      }
    });
  }

  protected onCompareDateChange(date: Date | null): void {
    this.compareDate.set(date);
    const profile = this.userProfile();
    if (!profile) return;

    this.userService.update({
      ...profile,
      weightCompareDate: date ? this.toDateString(date) : undefined,
    });
  }

  protected onWeightDateChange(date: Date): void {
    this.weightDate.set(date);
    const dateStr = this.toDateString(date);
    const existing = this.weightHistory().find((e) => e.date === dateStr);
    this.weightKg.set(existing?.weightKg ?? null);
    this.hasExistingWeight.set(!!existing);
  }

  protected onWeightBlur(): void {
    if (!this.hasExistingWeight()) return;

    const kg = this.weightKg();
    if (kg == null || kg < 1) return;

    const dateStr = this.toDateString(this.weightDate());
    const existing = this.weightHistory().find((e) => e.date === dateStr);
    if (existing && existing.weightKg === kg) return;

    this.saveWeight(kg);
  }

  protected onWeightButtonClick(): void {
    if (this.hasExistingWeight()) {
      this.removeWeight();
    } else {
      const kg = this.weightKg();
      if (kg != null && kg >= 1) {
        this.saveWeight(kg);
      }
    }
  }

  protected formatNumber(value: number): string {
    return value.toLocaleString(this.transloco.getActiveLang(), { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  protected formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  }

  private toDateString(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private refreshWeightHistory(profile: UserProfile): void {
    const sorted = [...(profile.weightHistory ?? [])].sort((a, b) => b.date.localeCompare(a.date));
    this.weightHistory.set(sorted);

    const dateStr = this.toDateString(this.weightDate());
    const existing = sorted.find((e) => e.date === dateStr);
    this.weightKg.set(existing?.weightKg ?? null);
    this.hasExistingWeight.set(!!existing);
  }

  private saveWeight(kg: number): void {
    const profile = this.userProfile();
    if (!profile) return;

    const dateStr = this.toDateString(this.weightDate());
    const history = [...(profile.weightHistory ?? [])];
    const existingIndex = history.findIndex((e) => e.date === dateStr);
    if (existingIndex >= 0) {
      history[existingIndex] = { date: dateStr, weightKg: kg };
    } else {
      history.push({ date: dateStr, weightKg: kg });
    }

    this.userService.update({ ...profile, weightHistory: history });
    this.hasExistingWeight.set(true);
  }

  private removeWeight(): void {
    const profile = this.userProfile();
    if (!profile) return;

    const dateStr = this.toDateString(this.weightDate());
    const history = (profile.weightHistory ?? []).filter((e) => e.date !== dateStr);
    this.userService.update({ ...profile, weightHistory: history });

    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('profile.weightRemoved'),
      life: 3000,
    });
  }
}
