import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { EquipmentService } from '../../equipment/data-access/equipment.service';
import { Exercise, ExerciseType, EXERCISE_TYPES, MuscleGroup, MUSCLE_GROUPS } from '../model/exercise.model';

interface MuscleGroupOption {
  label: string;
  value: MuscleGroup;
}

@Component({
  selector: 'app-exercise-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    InputText,
    MultiSelect,
    Select,
    ButtonModule,
  ],
  templateUrl: './exercise-dialog.html',
})
export class ExerciseDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly equipmentService = inject(EquipmentService);

  readonly visible = input(false);
  readonly exercise = input<Exercise | null>(null);
  readonly exerciseSaved = output<Exercise | Omit<Exercise, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly exerciseTypeOptions = computed(() =>
    EXERCISE_TYPES.map((t) => ({
      label: this.transloco.translate('exercise.types.' + t),
      value: t,
    })),
  );

  protected readonly muscleGroupOptions = computed<MuscleGroupOption[]>(() =>
    MUSCLE_GROUPS.map((mg) => ({
      label: this.transloco.translate('exercise.muscles.' + mg),
      value: mg,
    })),
  );

  protected readonly equipmentOptions = computed(() =>
    this.equipmentService.equipment().map((e) => ({
      label: e.name,
      value: e.id,
    })),
  );

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    type: ['strength' as ExerciseType, Validators.required],
    muscleGroups: [[] as MuscleGroup[], Validators.required],
    equipmentIds: [[] as string[]],
  });

  constructor() {
    effect(() => {
      const data = this.exercise();
      if (data) {
        this.form.patchValue(data);
      } else {
        this.form.reset({ type: 'strength', muscleGroups: [], equipmentIds: [] });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.exercise();
      const formValue = this.form.getRawValue();
      if (data) {
        this.exerciseSaved.emit({ ...formValue, id: data.id });
      } else {
        this.exerciseSaved.emit(formValue);
      }
      this.form.reset({ type: 'strength', muscleGroups: [] });
    }
  }
}
