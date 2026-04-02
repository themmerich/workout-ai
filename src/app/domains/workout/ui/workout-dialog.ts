import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { AuthService } from '../../../core/auth/auth.service';
import { LocationService } from '../../location/data-access/location.service';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { ExerciseComboService } from '../../exercise/data-access/exercise-combo.service';
import { Workout } from '../model/workout.model';

@Component({
  selector: 'app-workout-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonModule,
    DatePicker,
    Dialog,
    FloatLabel,
    InputNumber,
    InputText,
    Select,
  ],
  templateUrl: './workout-dialog.html',
})
export class WorkoutDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  protected readonly exerciseService = inject(ExerciseService);
  private readonly comboService = inject(ExerciseComboService);
  private readonly transloco = inject(TranslocoService);

  readonly visible = input(false);
  readonly workout = input<Workout | null>(null);
  readonly workoutSaved = output<Workout | Omit<Workout, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly locationOptions = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];

    const userLocations = this.locationService
      .locations()
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

    const combos = this.comboService.exerciseCombos().map((c) => ({
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
    description: [''],
    exercises: this.fb.array<FormGroup>([], Validators.required),
  });

  get exercisesArray(): FormArray<FormGroup> {
    return this.form.controls.exercises;
  }

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const data = this.workout();
      if (!isVisible) return;
      this.exercisesArray.clear();
      if (data) {
        this.form.patchValue({
          date: new Date(data.date),
          time: data.time,
          durationMinutes: data.durationMinutes ?? null,
          locationId: data.locationId ?? '__outdoor__',
          description: data.description ?? '',
        });
        for (const entry of [...data.exercises].sort((a, b) => a.orderIndex - b.orderIndex)) {
          const selection = entry.exerciseId
            ? `exercise:${entry.exerciseId}`
            : `combo:${entry.exerciseComboId}`;
          const isCardio = entry.exerciseId
            ? this.exerciseService.getById(entry.exerciseId)?.type === 'cardio'
            : false;

          const group = this.fb.nonNullable.group({
            selection: [selection, Validators.required],
            sets: this.fb.array<FormGroup>([]),
            segments: this.fb.array<FormGroup>([]),
          });

          if (isCardio && entry.segments?.length) {
            for (const seg of entry.segments) {
              (group.get('segments') as FormArray).push(this.createSegmentRow(seg.durationMinutes, seg.speedKmh, seg.heartRateBpm, seg.caloriesBurned));
            }
          } else if (entry.sets.length) {
            for (const set of entry.sets) {
              (group.get('sets') as FormArray).push(this.createSetRow(set.reps, set.weightKg));
            }
          } else {
            (group.get(isCardio ? 'segments' : 'sets') as FormArray).push(
              isCardio ? this.createSegmentRow() : this.createSetRow(),
            );
          }

          this.exercisesArray.push(group);
        }
      } else {
        this.form.reset({
          date: new Date(),
          time: '',
          durationMinutes: null,
          locationId: this.authService.currentUser()?.locationId ?? '',
          description: '',
        });
        this.addExercise();
      }
    });
  }

  protected addExercise(): void {
    const exerciseGroup = this.fb.nonNullable.group({
      selection: ['', Validators.required],
      sets: this.fb.array<FormGroup>([this.createSetRow()]),
      segments: this.fb.array<FormGroup>([this.createSegmentRow()]),
    });
    this.exercisesArray.push(exerciseGroup);
    this.form.markAsDirty();
  }

  protected removeExercise(index: number): void {
    this.exercisesArray.removeAt(index);
    this.form.markAsDirty();
  }

  protected isCardioExercise(exerciseIndex: number): boolean {
    const selection = this.exercisesArray.at(exerciseIndex).get('selection')?.value as string;
    if (!selection || !selection.startsWith('exercise:')) return false;
    const id = selection.split(':')[1];
    return this.exerciseService.getById(id)?.type === 'cardio';
  }

  protected onExerciseSelectionChange(exerciseIndex: number): void {
    const isCardio = this.isCardioExercise(exerciseIndex);
    const setsArray = this.getSetsArray(exerciseIndex);
    const segmentsArray = this.getSegmentsArray(exerciseIndex);

    if (isCardio) {
      setsArray.clear();
      if (segmentsArray.length === 0) {
        segmentsArray.push(this.createSegmentRow());
      }
    } else {
      segmentsArray.clear();
      if (setsArray.length === 0) {
        setsArray.push(this.createSetRow());
      }
    }
  }

  protected getSetsArray(exerciseIndex: number): FormArray<FormGroup> {
    return this.exercisesArray.at(exerciseIndex).get('sets') as FormArray<FormGroup>;
  }

  protected getSegmentsArray(exerciseIndex: number): FormArray<FormGroup> {
    return this.exercisesArray.at(exerciseIndex).get('segments') as FormArray<FormGroup>;
  }

  protected addSet(exerciseIndex: number): void {
    this.getSetsArray(exerciseIndex).push(this.createSetRow());
    this.form.markAsDirty();
  }

  protected removeSet(exerciseIndex: number, setIndex: number): void {
    this.getSetsArray(exerciseIndex).removeAt(setIndex);
    this.form.markAsDirty();
  }

  protected addSegment(exerciseIndex: number): void {
    this.getSegmentsArray(exerciseIndex).push(this.createSegmentRow());
    this.form.markAsDirty();
  }

  protected removeSegment(exerciseIndex: number, segmentIndex: number): void {
    this.getSegmentsArray(exerciseIndex).removeAt(segmentIndex);
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
          const isCardio = type === 'exercise' && this.exerciseService.getById(id)?.type === 'cardio';

          const sets = isCardio
            ? []
            : (ex['sets'] as Record<string, unknown>[]).map((s) => ({
                reps: s['reps'] as number,
                weightKg: (s['weightKg'] as number) || undefined,
              }));

          const segments = isCardio
            ? (ex['segments'] as Record<string, unknown>[]).map((s) => ({
                durationMinutes: (s['durationMinutes'] as number) || undefined,
                speedKmh: (s['speedKmh'] as number) || undefined,
                heartRateBpm: (s['heartRateBpm'] as number) || undefined,
                caloriesBurned: (s['caloriesBurned'] as number) || undefined,
              }))
            : undefined;

          return {
            ...(type === 'exercise' ? { exerciseId: id } : { exerciseComboId: id }),
            orderIndex: index,
            sets,
            segments,
          };
        },
      );

      const result = {
        userId: user.id,
        date: dateStr,
        time: formValue.time,
        durationMinutes: formValue.durationMinutes ?? undefined,
        locationId: formValue.locationId === '__outdoor__' ? null : formValue.locationId,
        description: formValue.description || undefined,
        exercises,
      };

      const data = this.workout();
      if (data) {
        this.workoutSaved.emit({ id: data.id, ...result });
      } else {
        this.workoutSaved.emit(result);
      }
    }
  }

  private createSetRow(reps = 1, weightKg?: number): FormGroup {
    return this.fb.nonNullable.group({
      reps: [reps, [Validators.required, Validators.min(1)]],
      weightKg: [weightKg ?? (null as number | null)],
    });
  }

  private createSegmentRow(durationMinutes?: number, speedKmh?: number, heartRateBpm?: number, caloriesBurned?: number): FormGroup {
    return this.fb.nonNullable.group({
      durationMinutes: [durationMinutes ?? (null as number | null)],
      speedKmh: [speedKmh ?? (null as number | null)],
      heartRateBpm: [heartRateBpm ?? (null as number | null)],
      caloriesBurned: [caloriesBurned ?? (null as number | null)],
    });
  }
}
