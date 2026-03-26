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
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { UserProfile } from '../model/user.model';

interface RoleOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-user-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoDirective, Dialog, InputText, Select, ButtonModule],
  template: `
    <p-dialog
      *transloco="let t"
      [header]="user() ? t('user.dialog.editTitle') : t('user.dialog.title')"
      [visible]="visible()"
      (visibleChange)="dialogClosed.emit()"
      [modal]="true"
      [style]="{ width: '450px' }"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4 pt-4">
        <div class="flex flex-col gap-1">
          <label for="username" class="font-medium text-surface-700 dark:text-surface-200">{{ t('user.username') }}</label>
          <input pInputText id="username" formControlName="username" />
          @if (form.controls.username.touched && form.controls.username.errors?.['required']) {
            <small class="text-red-500">{{ t('user.validation.required') }}</small>
          }
        </div>
        <div class="flex flex-col gap-1">
          <label for="displayName" class="font-medium text-surface-700 dark:text-surface-200">{{ t('user.name') }}</label>
          <input pInputText id="displayName" formControlName="displayName" />
          @if (form.controls.displayName.touched && form.controls.displayName.errors?.['required']) {
            <small class="text-red-500">{{ t('user.validation.required') }}</small>
          }
        </div>
        <div class="flex flex-col gap-1">
          <label for="email" class="font-medium text-surface-700 dark:text-surface-200">{{ t('user.email') }}</label>
          <input pInputText id="email" formControlName="email" type="email" />
          @if (form.controls.email.touched && form.controls.email.errors?.['required']) {
            <small class="text-red-500">{{ t('user.validation.required') }}</small>
          }
          @if (form.controls.email.touched && form.controls.email.errors?.['email']) {
            <small class="text-red-500">{{ t('user.validation.email') }}</small>
          }
        </div>
        <div class="flex flex-col gap-1">
          <label for="role" class="font-medium text-surface-700 dark:text-surface-200">{{ t('user.role') }}</label>
          <p-select
            formControlName="role"
            [options]="roleOptions"
            optionLabel="label"
            optionValue="value"
            inputId="role"
          />
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
            [disabled]="form.invalid"
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

  protected readonly roleOptions: RoleOption[] = [
    { label: 'User', value: 'user' },
    { label: 'Administrator', value: 'admin' },
  ];

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
