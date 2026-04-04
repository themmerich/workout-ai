import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkoutService } from '../data-access/workout.service';
import { WorkoutHeatmapComponent } from '../ui/workout-heatmap';

@Component({
  selector: 'app-workout-calendar-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0 p-4' },
  imports: [WorkoutHeatmapComponent],
  templateUrl: './workout-calendar-page.html',
})
export default class WorkoutCalendarPageComponent {
  private readonly authService = inject(AuthService);
  private readonly workoutService = inject(WorkoutService);

  protected readonly workoutDates = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.workoutService.getByUserId(user.id).map((w) => w.date);
  });
}
