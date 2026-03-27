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
import { UserProfile } from '../model/user.model';

@Component({
  selector: 'app-user-dialog',
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
  template: `
    <p-dialog
      *transloco="let t"
      [header]="user() ? t('user.dialog.editTitle') : t('user.dialog.title')"
      [visible]="visible()"
      (visibleChange)="dialogClosed.emit()"
      [modal]="true"
      [style]="{ width: '450px' }"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5 pt-6">
        <div>
          <p-floatlabel variant="on">
            <input pInputText id="username" formControlName="username" class="w-full" />
            <label for="username">{{ t('user.username') }} *</label>
          </p-floatlabel>
          @if (form.controls.username.touched && form.controls.username.errors?.['required']) {
            <small class="text-red-500">{{ t('user.validation.required') }}</small>
          }
        </div>
        <div>
          <p-floatlabel variant="on">
            <input pInputText id="displayName" formControlName="displayName" class="w-full" />
            <label for="displayName">{{ t('user.name') }} *</label>
          </p-floatlabel>
          @if (form.controls.displayName.touched && form.controls.displayName.errors?.['required']) {
            <small class="text-red-500">{{ t('user.validation.required') }}</small>
          }
        </div>
        <div>
          <p-floatlabel variant="on">
            <input pInputText id="email" formControlName="email" type="email" class="w-full" />
            <label for="email">{{ t('user.email') }} *</label>
          </p-floatlabel>
          @if (form.controls.email.touched && form.controls.email.errors?.['required']) {
            <small class="text-red-500">{{ t('user.validation.required') }}</small>
          }
          @if (form.controls.email.touched && form.controls.email.errors?.['email']) {
            <small class="text-red-500">{{ t('user.validation.email') }}</small>
          }
        </div>
        <div>
          <p-floatlabel variant="on">
            <p-select
              formControlName="role"
              [options]="roleOptions"
              inputId="role"
              styleClass="w-full"
            >
              <ng-template #selectedItem let-selected>
                {{ t('user.roles.' + selected) }}
              </ng-template>
              <ng-template #item let-option>
                {{ t('user.roles.' + option) }}
              </ng-template>
            </p-select>
            <label for="role">{{ t('user.role') }} *</label>
          </p-floatlabel>
        </div>
        <div class="flex justify-end gap-2 pt-4">
          <p-button
            [label]="t('user.dialog.cancel')"
            severity="secondary"
            (onClick)="dialogClosed.emit()"
          />
          <p-button
            [label]="t('user.dialog.save')"
            type="submit"
            [disabled]="form.invalid || !form.dirty"
          />
        </div>
      </form>
    </p-dialog>
  `,
})
export class UserDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly visible = input(false);
  readonly user = input<UserProfile | null>(null);
  readonly userSaved = output<UserProfile | Omit<UserProfile, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly roleOptions: string[] = ['user', 'admin'];

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required],
  });

  constructor() {
    effect(() => {
      const userData = this.user();
      if (userData) {
        this.form.patchValue(userData);
      } else {
        this.form.reset({ role: 'user' });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const userData = this.user();
      if (userData) {
        this.userSaved.emit({ ...this.form.getRawValue(), id: userData.id });
      } else {
        this.userSaved.emit(this.form.getRawValue());
      }
      this.form.reset({ role: 'user' });
    }
  }
}
