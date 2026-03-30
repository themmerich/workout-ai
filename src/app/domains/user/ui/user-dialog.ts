import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../../../shared/utils/email.validator';
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
    FormsModule,
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    InputText,
    Select,
    ButtonModule,
  ],
  templateUrl: './user-dialog.html',
})
export class UserDialogComponent {
  private readonly fb = inject(FormBuilder);

  readonly visible = input(false);
  readonly user = input<UserProfile | null>(null);
  readonly userSaved = output<UserProfile | Omit<UserProfile, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly isAdmin = signal(false);
  protected readonly selectedRole = signal('user');
  protected formDirty = signal(false);

  protected readonly roleOptions = [
    { label: 'user', value: 'user' },
    { label: 'admin', value: 'admin' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, emailValidator()]],
    password: [''],
  });

  constructor() {
    effect(() => {
      const userData = this.user();
      if (userData) {
        this.form.patchValue({
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password ?? '',
        });
        this.selectedRole.set(userData.role);
        this.isAdmin.set(userData.role === 'admin');
      } else {
        this.form.reset({ password: '' });
        this.selectedRole.set('user');
        this.isAdmin.set(false);
      }
      this.formDirty.set(false);
    });
  }

  protected onRoleChange(role: string): void {
    this.selectedRole.set(role);
    this.isAdmin.set(role === 'admin');
    this.formDirty.set(true);
    if (role === 'admin' && !this.form.controls.password.value) {
      this.form.controls.password.setValue(this.form.controls.username.value);
    }
    if (role !== 'admin') {
      this.form.controls.password.setValue('');
    }
  }

  protected get isDirty(): boolean {
    return this.form.dirty || this.formDirty();
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const userData = this.user();
      const formValue = this.form.getRawValue();
      const role = this.selectedRole();
      const result = {
        username: formValue.username,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        role,
        password: role === 'admin' ? formValue.password : undefined,
      };

      if (userData) {
        this.userSaved.emit({ ...result, id: userData.id });
      } else {
        this.userSaved.emit(result);
      }
      this.form.reset({ password: '' });
      this.selectedRole.set('user');
      this.isAdmin.set(false);
      this.formDirty.set(false);
    }
  }
}
