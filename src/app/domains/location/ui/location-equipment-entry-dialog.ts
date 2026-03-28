import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';

export interface EquipmentOptionWithCategory {
  label: string;
  value: string;
  category: string;
}

export interface EquipmentEntryData {
  id: string;
  equipmentId: string;
  quantity: number;
  weight: number | null;
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
  readonly equipmentOptions = input<EquipmentOptionWithCategory[]>([]);
  readonly entrySaved = output<EquipmentEntryData>();
  readonly dialogClosed = output<void>();

  protected readonly showWeight = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    equipmentId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    weight: [null as number | null],
  });

  constructor() {
    effect(() => {
      const data = this.entry();
      if (data) {
        this.form.patchValue({ equipmentId: data.equipmentId, quantity: data.quantity, weight: data.weight });
        this.showWeight.set(this.isDumbbellCategory(data.equipmentId));
      } else {
        this.form.reset({ equipmentId: '', quantity: 1, weight: null });
        this.showWeight.set(false);
      }
    });

    this.form.controls.equipmentId.valueChanges.subscribe((equipmentId) => {
      const isDumbbell = this.isDumbbellCategory(equipmentId);
      this.showWeight.set(isDumbbell);
      if (!isDumbbell) {
        this.form.controls.weight.setValue(null);
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
        weight: this.showWeight() ? formValue.weight : null,
      });
      this.form.reset({ equipmentId: '', quantity: 1, weight: null });
      this.showWeight.set(false);
    }
  }

  private isDumbbellCategory(equipmentId: string): boolean {
    const option = this.equipmentOptions().find((o) => o.value === equipmentId);
    return option?.category === 'dumbbell';
  }
}
