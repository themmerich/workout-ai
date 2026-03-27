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
import { Location } from '../model/location.model';

@Component({
  selector: 'app-location-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    InputText,
    ButtonModule,
  ],
  templateUrl: './location-dialog.html',
})
export class LocationDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly visible = input(false);
  readonly location = input<Location | null>(null);
  readonly locationSaved = output<Location | Omit<Location, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    street: ['', Validators.required],
    zip: ['', Validators.required],
    city: ['', Validators.required],
    country: [''],
    phone: [''],
    email: ['', Validators.email],
    website: [''],
  });

  constructor() {
    effect(() => {
      const data = this.location();
      if (data) {
        this.form.patchValue(data);
      } else {
        this.form.reset();
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.location();
      if (data) {
        this.locationSaved.emit({ ...this.form.getRawValue(), id: data.id });
      } else {
        this.locationSaved.emit(this.form.getRawValue());
      }
      this.form.reset();
    }
  }
}
