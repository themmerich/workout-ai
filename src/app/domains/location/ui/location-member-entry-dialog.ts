import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { UserService } from '../../user/data-access/user.service';
import { LOCATION_MEMBER_ROLES, LocationMemberRole } from '../model/location.model';

export interface MemberEntryData {
  id: string;
  userId: string;
  role: LocationMemberRole;
  password: string;
}

@Component({
  selector: 'app-location-member-entry-dialog',
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
  templateUrl: './location-member-entry-dialog.html',
})
export class LocationMemberEntryDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);
  private readonly userService = inject(UserService);

  readonly visible = input(false);
  readonly entry = input<MemberEntryData | null>(null);
  readonly userOptions = input<{ label: string; value: string }[]>([]);
  readonly entrySaved = output<MemberEntryData>();
  readonly dialogClosed = output<void>();

  protected readonly roleOptions = computed(() =>
    LOCATION_MEMBER_ROLES.map((r) => ({
      label: this.transloco.translate('location.dialog.memberRoles.' + r),
      value: r,
    })),
  );

  protected readonly form = this.fb.nonNullable.group({
    userId: ['', Validators.required],
    role: ['member' as LocationMemberRole, Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const data = this.entry();
      if (data) {
        this.form.patchValue({ userId: data.userId, role: data.role, password: data.password });
      } else {
        this.form.reset({ userId: '', role: 'member', password: '' });
      }
    });
  }

  protected onUserChange(userId: string): void {
    const user = this.userService.getById(userId);
    if (user && !this.form.controls.password.dirty) {
      this.form.controls.password.setValue(user.username);
    }
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.entry();
      const formValue = this.form.getRawValue();
      this.entrySaved.emit({
        id: data?.id ?? crypto.randomUUID(),
        userId: formValue.userId,
        role: formValue.role,
        password: formValue.password,
      });
      this.form.reset({ userId: '', role: 'member', password: '' });
    }
  }
}
