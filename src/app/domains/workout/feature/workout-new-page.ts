import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { WorkoutService } from '../data-access/workout.service';
import { Workout } from '../model/workout.model';
import { WorkoutDialogComponent } from '../ui/workout-dialog';

@Component({
  selector: 'app-workout-new-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [Toast, WorkoutDialogComponent],
  providers: [MessageService],
  templateUrl: './workout-new-page.html',
})
export default class WorkoutNewPageComponent {
  private readonly workoutService = inject(WorkoutService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);

  protected onSaveWorkout(item: Workout | Omit<Workout, 'id'>): void {
    this.workoutService.add(item as Omit<Workout, 'id'>);
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('workout.createSuccess'),
      life: 3000,
    });
    setTimeout(() => this.router.navigate(['/workouts/list']), 500);
  }

  protected onCancel(): void {
    this.router.navigate(['/workouts/list']);
  }
}
