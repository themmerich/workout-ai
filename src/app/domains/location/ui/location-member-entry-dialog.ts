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
import { Select } from 'primeng/select';
import { LOCATION_MEMBER_ROLES, LocationMemberRole } from '../model/location.model';

export interface MemberEntryData {
  id: string;
  userId: string;
  role: LocationMemberRole;
}

@Component({
  selector: 'app-location-member-entry-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    Dialog,
    FloatLabel,
    Select,
    ButtonModule,
  ],
  templateUrl: './location-member-entry-dialog.html',
})
export class LocationMemberEntryDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);

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
  });

  constructor() {
    effect(() => {
      const data = this.entry();
      if (data) {
        this.form.patchValue({ userId: data.userId, role: data.role });
      } else {
        this.form.reset({ userId: '', role: 'member' });
      }
    });
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const data = this.entry();
      const formValue = this.form.getRawValue();
      this.entrySaved.emit({
        id: data?.id ?? crypto.randomUUID(),
        userId: formValue.userId,
        role: formValue.role,
      });
      this.form.reset({ userId: '', role: 'member' });
    }
  }
}
