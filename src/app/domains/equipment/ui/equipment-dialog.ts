import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Equipment, EquipmentCategory, EQUIPMENT_CATEGORIES } from '../model/equipment.model';

@Component({
  selector: 'app-equipment-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    InputText,
    Select,
    ButtonModule,
  ],
  templateUrl: './equipment-dialog.html',
})
export class EquipmentDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly visible = input(false);
  readonly equipment = input<Equipment | null>(null);
  readonly equipmentSaved = output<Equipment | Omit<Equipment, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly categoryOptions = [...EQUIPMENT_CATEGORIES];

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['dumbbell' as EquipmentCategory, Validators.required],
  });

  constructor() {
    effect(() => {
      const data = this.equipment();
      if (data) {
        this.form.patchValue(data);
      } else {
        this.form.reset({ category: 'dumbbell' });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.equipment();
      const formValue = this.form.getRawValue();
      if (data) {
        this.equipmentSaved.emit({ ...formValue, id: data.id });
      } else {
        this.equipmentSaved.emit(formValue);
      }
      this.form.reset({ category: 'dumbbell' });
    }
  }
}
