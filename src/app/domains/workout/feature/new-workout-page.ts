import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';
import { LocationService } from '../../location/data-access/location.service';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { ExerciseComboService } from '../../exercise-combo/data-access/exercise-combo.service';
import { WorkoutService } from '../data-access/workout.service';

@Component({
  selector: 'app-new-workout-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  providers: [MessageService],
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonModule,
    DatePicker,
    FloatLabel,
    InputNumber,
    InputText,
    Select,
    Toast,
  ],
  templateUrl: './new-workout-page.html',
})
export default class NewWorkoutPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly comboService = inject(ExerciseComboService);
  private readonly workoutService = inject(WorkoutService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  protected readonly locationOptions = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];

    const userLocations = this.locationService
      .getAll()
      .filter((loc) => loc.members.some((m) => m.userId === user.id))
      .map((loc) => ({ label: loc.name, value: loc.id }));

    return [
      ...userLocations,
      { label: this.transloco.translate('workout.outdoor'), value: '__outdoor__' },
    ];
  });

  protected readonly exerciseOptions = computed(() => {
    const exercises = this.exerciseService.exercises().map((e) => ({
      label: e.name,
      value: `exercise:${e.id}`,
    }));

    const combos = this.comboService.combos().map((c) => ({
      label: c.name,
      value: `combo:${c.id}`,
    }));

    return [
      { label: this.transloco.translate('workout.exerciseGroup'), items: exercises },
      { label: this.transloco.translate('workout.comboGroup'), items: combos },
    ];
  });

  protected readonly form = this.fb.nonNullable.group({
    date: [new Date() as Date | null, Validators.required],
    time: [''],
    durationMinutes: [null as number | null, Validators.min(1)],
    locationId: [this.authService.currentUser()?.locationId ?? ''],
    exercises: this.fb.array<FormGroup>([], Validators.required),
  });

  get exercisesArray(): FormArray<FormGroup> {
    return this.form.controls.exercises;
  }

  protected addExercise(): void {
    const exerciseGroup = this.fb.nonNullable.group({
      selection: ['', Validators.required],
      sets: this.fb.array<FormGroup>([this.createSetRow()], Validators.required),
    });
    this.exercisesArray.push(exerciseGroup);
    this.form.markAsDirty();
  }

  protected removeExercise(index: number): void {
    this.exercisesArray.removeAt(index);
    this.form.markAsDirty();
  }

  protected getSetsArray(exerciseIndex: number): FormArray<FormGroup> {
    return this.exercisesArray.at(exerciseIndex).get('sets') as FormArray<FormGroup>;
  }

  protected addSet(exerciseIndex: number): void {
    this.getSetsArray(exerciseIndex).push(this.createSetRow());
    this.form.markAsDirty();
  }

  protected removeSet(exerciseIndex: number, setIndex: number): void {
    this.getSetsArray(exerciseIndex).removeAt(setIndex);
    this.form.markAsDirty();
  }

  protected onSubmit(): void {
    if (this.form.valid && this.exercisesArray.length > 0) {
      const formValue = this.form.getRawValue();
      const user = this.authService.currentUser();
      if (!user) return;

      const date = formValue.date;
      const dateStr = date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        : '';

      const exercises = formValue.exercises.map(
        (ex: Record<string, unknown>, index: number) => {
          const selection = ex['selection'] as string;
          const [type, id] = selection.split(':');
          const sets = (ex['sets'] as Record<string, unknown>[]).map((s) => ({
            reps: s['reps'] as number,
            weightKg: (s['weightKg'] as number) || undefined,
          }));

          return {
            ...(type === 'exercise' ? { exerciseId: id } : { exerciseComboId: id }),
            orderIndex: index,
            sets,
          };
        },
      );

      this.workoutService.add({
        userId: user.id,
        date: dateStr,
        time: formValue.time,
        durationMinutes: formValue.durationMinutes ?? undefined,
        locationId: formValue.locationId === '__outdoor__' ? null : formValue.locationId,
        exercises,
      });

      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('workout.saveSuccess'),
        life: 3000,
      });

      this.form.reset({ date: null, time: '', durationMinutes: null, locationId: '' });
      this.exercisesArray.clear();
    }
  }

  private createSetRow(): FormGroup {
    return this.fb.nonNullable.group({
      reps: [1, [Validators.required, Validators.min(1)]],
      weightKg: [null as number | null],
    });
  }
}
