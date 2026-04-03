import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { AnnouncementSeverity, ANNOUNCEMENT_SEVERITIES, LocationAnnouncement } from '../model/location.model';

@Component({
  selector: 'app-announcement-dialog',
  templateUrl: './announcement-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ReactiveFormsModule, Dialog, Button, FloatLabel, InputText, Textarea, Select],
})
export class AnnouncementDialogComponent {
  readonly visible = input.required<boolean>();
  readonly announcement = input<LocationAnnouncement | null>(null);

  readonly announcementSaved = output<Omit<LocationAnnouncement, 'id' | 'createdDate'>>();
  readonly dialogClosed = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly transloco = inject(TranslocoService);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    message: ['', Validators.required],
    severity: ['info' as AnnouncementSeverity, Validators.required],
  });

  readonly severityOptions = computed(() =>
    ANNOUNCEMENT_SEVERITIES.map((s) => ({
      label: this.transloco.translate(`announcement.severities.${s}`),
      value: s,
    })),
  );

  constructor() {
    effect(() => {
      const a = this.announcement();
      if (a) {
        this.form.patchValue({ title: a.title, message: a.message, severity: a.severity });
      } else {
        this.form.reset({ title: '', message: '', severity: 'info' });
      }
      this.form.markAsPristine();
    });
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.dialogClosed.emit();
    }
  }

  onSave(): void {
    if (this.form.valid) {
      this.announcementSaved.emit(this.form.getRawValue());
    }
  }
}
