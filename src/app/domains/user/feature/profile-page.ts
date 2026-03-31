import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../../shared/utils/email.validator';
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
import { UserService } from '../data-access/user.service';
import { COUNTRIES, DEFAULT_COUNTRY } from '../../../shared/utils/countries';
import { Gender, GENDERS, Salutation, SALUTATIONS, UserProfile } from '../model/user.model';

@Component({
  selector: 'app-profile-page',
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
  templateUrl: './profile-page.html',
})
export default class ProfilePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  protected readonly userProfile = computed<UserProfile | undefined>(() => {
    const user = this.authService.currentUser();
    return user ? this.userService.getById(user.id) : undefined;
  });

  protected readonly salutationOptions = computed(() =>
    SALUTATIONS.map((s) => ({
      label: this.transloco.translate('profile.salutations.' + s),
      value: s,
    })),
  );

  protected readonly genderOptions = computed(() =>
    GENDERS.map((g) => ({
      label: this.transloco.translate('profile.genders.' + g),
      value: g,
    })),
  );

  protected readonly countries = COUNTRIES;

  protected readonly minBirthDate = new Date(1940, 0, 1);
  protected readonly maxBirthDate = new Date(2010, 11, 31);
  protected readonly defaultBirthDate = new Date(1985, 0, 1);

  protected readonly form = this.fb.group({
    salutation: [null as Salutation | null],
    gender: [null as Gender | null],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, emailValidator()]],
    birthDate: [null as Date | null],
    heightCm: [null as number | null],
    phone: [''],
    street: [''],
    zip: [''],
    city: [''],
    country: [DEFAULT_COUNTRY],
  });

  constructor() {
    effect(() => {
      const profile = this.userProfile();
      if (profile) {
        this.form.patchValue({
          salutation: profile.salutation ?? null,
          gender: profile.gender ?? null,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          birthDate: profile.birthDate ? new Date(profile.birthDate) : null,
          heightCm: profile.heightCm ?? null,
          phone: profile.phone ?? '',
          street: profile.street ?? '',
          zip: profile.zip ?? '',
          city: profile.city ?? '',
          country: profile.country || DEFAULT_COUNTRY,
        });
      }
    });
  }

  protected onSaveProfile(): void {
    const profile = this.userProfile();
    if (this.form.valid && profile) {
      const formValue = this.form.getRawValue();
      const birthDate = formValue.birthDate;
      const birthDateStr = birthDate
        ? `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`
        : undefined;

      this.userService.update({
        ...profile,
        salutation: formValue.salutation ?? undefined,
        gender: formValue.gender ?? undefined,
        firstName: formValue.firstName ?? profile.firstName,
        lastName: formValue.lastName ?? profile.lastName,
        email: formValue.email ?? profile.email,
        birthDate: birthDateStr,
        heightCm: formValue.heightCm ?? undefined,
        phone: formValue.phone || undefined,
        street: formValue.street || undefined,
        zip: formValue.zip || undefined,
        city: formValue.city || undefined,
        country: formValue.country || undefined,
      });

      const currentUser = this.authService.currentUser();
      if (currentUser) {
        this.authService.currentUser.set({
          ...currentUser,
          firstName: formValue.firstName ?? currentUser.firstName,
          lastName: formValue.lastName ?? currentUser.lastName,
          email: formValue.email ?? currentUser.email,
        });
      }

      this.form.markAsPristine();
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('profile.saveSuccess'),
        life: 3000,
      });
    }
  }
}
