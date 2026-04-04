import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { WorkoutService } from '../data-access/workout.service';
import { WorkoutProgressionComponent } from '../ui/workout-progression';

@Component({
  selector: 'app-workout-progression-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0 p-4' },
  imports: [WorkoutProgressionComponent],
  templateUrl: './workout-progression-page.html',
})
export default class WorkoutProgressionPageComponent {
  private readonly authService = inject(AuthService);
  private readonly workoutService = inject(WorkoutService);

  protected readonly exerciseWorkoutData = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.workoutService
      .getByUserId(user.id)
      .sort((a, b) => b.date.localeCompare(a.date))
      .flatMap((w) =>
        w.exercises
          .filter((e) => e.exerciseId)
          .map((e) => ({ date: w.date, exerciseId: e.exerciseId!, sets: e.sets })),
      );
  });
}
