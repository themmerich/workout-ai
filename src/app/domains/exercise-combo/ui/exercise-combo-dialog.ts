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
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { COMBO_TYPES, ComboType, ExerciseCombo } from '../model/exercise-combo.model';

@Component({
  selector: 'app-exercise-combo-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    InputText,
    InputNumber,
    Select,
    Textarea,
    ButtonModule,
  ],
  templateUrl: './exercise-combo-dialog.html',
})
export class ExerciseComboDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly exerciseService = inject(ExerciseService);

  readonly visible = input(false);
  readonly combo = input<ExerciseCombo | null>(null);
  readonly comboSaved = output<ExerciseCombo | Omit<ExerciseCombo, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly exerciseOptions = computed(() =>
    this.exerciseService.exercises().map((e) => ({
      label: e.name,
      value: e.id,
    })),
  );

  protected readonly comboTypeOptions = computed(() =>
    COMBO_TYPES.map((t) => ({
      label: this.transloco.translate('exerciseCombo.types.' + t),
      value: t,
    })),
  );

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    type: ['amrap' as ComboType, Validators.required],
    timeLimitMinutes: [null as number | null],
    description: [''],
    exercises: this.fb.array<FormGroup>([], Validators.required),
  });

  get exercisesArray(): FormArray<FormGroup> {
    return this.form.controls.exercises;
  }

  constructor() {
    effect(() => {
      const data = this.combo();
      this.exercisesArray.clear();
      if (data) {
        this.form.patchValue({
          name: data.name,
          type: data.type,
          timeLimitMinutes: data.timeLimitMinutes ?? null,
          description: data.description ?? '',
        });
        const sorted = [...data.exercises].sort((a, b) => a.orderIndex - b.orderIndex);
        for (const ex of sorted) {
          this.exercisesArray.push(this.createExerciseRow(ex.exerciseId, ex.reps, ex.weightKg));
        }
      } else {
        this.form.reset({ name: '', type: 'amrap', timeLimitMinutes: null, description: '' });
      }
    });
  }

  protected addExerciseRow(): void {
    this.exercisesArray.push(this.createExerciseRow('', 1));
    this.form.markAsDirty();
  }

  protected removeExerciseRow(index: number): void {
    this.exercisesArray.removeAt(index);
    this.form.markAsDirty();
  }

  protected onSubmit(): void {
    if (this.form.valid && this.exercisesArray.length > 0) {
      const formValue = this.form.getRawValue();
      const exercises = formValue.exercises.map(
        (ex: Record<string, unknown>, index: number) => ({
          exerciseId: ex['exerciseId'] as string,
          reps: ex['reps'] as number,
          weightKg: (ex['weightKg'] as number) || undefined,
          orderIndex: index,
        }),
      );

      const data = this.combo();
      const shared = {
        name: formValue.name,
        type: formValue.type,
        timeLimitMinutes: formValue.timeLimitMinutes || undefined,
        description: formValue.description || undefined,
        exercises,
      };
      if (data) {
        this.comboSaved.emit({ id: data.id, ...shared });
      } else {
        this.comboSaved.emit(shared);
      }
      this.form.reset({ name: '', type: 'amrap', timeLimitMinutes: null, description: '' });
      this.exercisesArray.clear();
    }
  }

  private createExerciseRow(exerciseId: string, reps: number, weightKg?: number): FormGroup {
    return this.fb.nonNullable.group({
      exerciseId: [exerciseId, Validators.required],
      reps: [reps, [Validators.required, Validators.min(1)]],
      weightKg: [weightKg ?? (null as number | null)],
    });
  }
}
