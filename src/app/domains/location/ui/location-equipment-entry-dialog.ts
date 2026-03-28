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
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

export interface EquipmentEntryData {
  id: string;
  equipmentId: string;
  quantity: number;
}

@Component({
  selector: 'app-location-equipment-entry-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    InputNumber,
    Select,
    ButtonModule,
  ],
  templateUrl: './location-equipment-entry-dialog.html',
})
export class LocationEquipmentEntryDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly visible = input(false);
  readonly entry = input<EquipmentEntryData | null>(null);
  readonly equipmentOptions = input<{ label: string; value: string }[]>([]);
  readonly entrySaved = output<EquipmentEntryData>();
  readonly dialogClosed = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    equipmentId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    effect(() => {
      const data = this.entry();
      if (data) {
        this.form.patchValue({ equipmentId: data.equipmentId, quantity: data.quantity });
      } else {
        this.form.reset({ equipmentId: '', quantity: 1 });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.entry();
      const formValue = this.form.getRawValue();
      this.entrySaved.emit({
        id: data?.id ?? crypto.randomUUID(),
        equipmentId: formValue.equipmentId,
        quantity: formValue.quantity,
      });
      this.form.reset({ equipmentId: '', quantity: 1 });
    }
  }
}
