import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../core/auth/auth.service';
import { EquipmentService } from '../../equipment/data-access/equipment.service';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { LocationService } from '../../location/data-access/location.service';
import { UserService } from '../../user/data-access/user.service';

@Component({
  selector: 'app-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ChartModule, CardModule],
  templateUrl: './dashboard-page.html',
})
export default class DashboardPageComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly locationService = inject(LocationService);
  private readonly equipmentService = inject(EquipmentService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly transloco = inject(TranslocoService);

  protected readonly isAdmin = this.authService.isAdmin;
  protected readonly currentUser = this.authService.currentUser;

  protected readonly locationCount = computed(() => this.locationService.locations().length);
  protected readonly userCount = computed(() => this.userService.users().length);
  protected readonly exerciseCount = computed(() => this.exerciseService.exercises().length);
  protected readonly equipmentCount = computed(() => this.equipmentService.equipment().length);

  protected readonly totalMemberships = computed(() =>
    this.locationService.locations().reduce((sum, l) => sum + l.members.length, 0),
  );

  protected readonly userRoleChartData = computed(() => {
    const users = this.userService.users();
    const admins = users.filter((u) => u.role === 'admin').length;
    const regular = users.length - admins;
    return {
      labels: [this.transloco.translate('user.roles.admin'), this.transloco.translate('user.roles.user')],
      datasets: [{
        data: [admins, regular],
        backgroundColor: ['#f97316', '#3b82f6'],
      }],
    };
  });

  protected readonly equipmentCategoryChartData = computed(() => {
    const equipment = this.equipmentService.equipment();
    const categories = new Map<string, number>();
    equipment.forEach((e) => {
      categories.set(e.category, (categories.get(e.category) ?? 0) + 1);
    });
    return {
      labels: [...categories.keys()].map((c) => this.transloco.translate('equipment.categories.' + c)),
      datasets: [{
        data: [...categories.values()],
        backgroundColor: ['#6366f1', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#ec4899', '#8b5cf6', '#14b8a6'],
      }],
    };
  });

  protected readonly exerciseMuscleChartData = computed(() => {
    const exercises = this.exerciseService.exercises();
    const muscles = new Map<string, number>();
    exercises.forEach((e) => {
      e.muscleGroups.forEach((mg) => {
        muscles.set(mg, (muscles.get(mg) ?? 0) + 1);
      });
    });
    const sorted = [...muscles.entries()].sort((a, b) => b[1] - a[1]);
    return {
      labels: sorted.map(([mg]) => this.transloco.translate('exercise.muscles.' + mg)),
      datasets: [{
        data: sorted.map(([, count]) => count),
        backgroundColor: '#6366f1',
        borderRadius: 4,
      }],
    };
  });

  protected readonly memberRoleChartData = computed(() => {
    const locations = this.locationService.locations();
    const roles = new Map<string, number>();
    locations.forEach((l) => {
      l.members.forEach((m) => {
        roles.set(m.role, (roles.get(m.role) ?? 0) + 1);
      });
    });
    return {
      labels: [...roles.keys()].map((r) => this.transloco.translate('location.dialog.memberRoles.' + r)),
      datasets: [{
        data: [...roles.values()],
        backgroundColor: ['#f97316', '#22c55e', '#3b82f6'],
      }],
    };
  });

  protected readonly chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 }, padding: 8 },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  protected readonly barChartOptions = {
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#94a3b8', font: { size: 10 }, maxRotation: 45 }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8', font: { size: 10 }, stepSize: 1 }, grid: { color: 'rgba(148,163,184,0.1)' } },
    },
  };

  // Member dashboard data
  protected readonly currentLocation = computed(() => {
    const user = this.currentUser();
    if (user?.locationId) {
      return this.locationService.getById(user.locationId) ?? null;
    }
    return null;
  });

  protected readonly locationEquipmentCount = computed(() =>
    this.currentLocation()?.equipment.length ?? 0,
  );

  protected readonly locationMemberCount = computed(() =>
    this.currentLocation()?.members.length ?? 0,
  );
}
