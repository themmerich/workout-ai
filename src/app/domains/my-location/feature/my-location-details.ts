import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';
import { LocationService } from '../../location/data-access/location.service';
import { LOGO_COLORS } from '../../location/model/location.model';
import { LocationLogoComponent } from '../../location/ui/location-logo';

@Component({
  selector: 'app-my-location-details',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [ReactiveFormsModule, TranslocoDirective, ButtonModule, FloatLabel, InputText, Toast, LocationLogoComponent],
  templateUrl: './my-location-details.html',
})
export default class MyLocationDetailsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  protected readonly logoColors = LOGO_COLORS;
  protected readonly logoColor = signal(LOGO_COLORS[0]);
  protected readonly logoImageUrl = signal<string | null>(null);
  protected logoDirty = signal(false);

  protected readonly location = computed(() => {
    const user = this.authService.currentUser();
    return user?.locationId ? this.locationService.getById(user.locationId) ?? null : null;
  });

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
      const loc = this.location();
      if (loc) {
        this.form.patchValue(loc);
        this.logoColor.set(loc.logo?.color ?? LOGO_COLORS[0]);
        this.logoImageUrl.set(loc.logo?.imageUrl ?? null);
        this.logoDirty.set(false);
      }
    });
  }

  protected get isDirty(): boolean {
    return this.form.dirty || this.logoDirty();
  }

  protected onLogoColorChange(color: string): void {
    this.logoColor.set(color);
    this.logoDirty.set(true);
  }

  protected onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoImageUrl.set(reader.result as string);
        this.logoDirty.set(true);
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  protected onLogoImageRemove(): void {
    this.logoImageUrl.set(null);
    this.logoDirty.set(true);
  }

  protected onSave(): void {
    const loc = this.location();
    if (this.form.valid && loc) {
      this.locationService.update({
        ...loc,
        ...this.form.getRawValue(),
        logo: { color: this.logoColor(), imageUrl: this.logoImageUrl() },
      });
      this.form.markAsPristine();
      this.logoDirty.set(false);
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('myLocation.details.saveSuccess'),
        life: 3000,
      });
    }
  }
}
