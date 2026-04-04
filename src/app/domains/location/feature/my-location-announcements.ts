import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';
import { LocationService } from '../data-access/location.service';
import { AnnouncementSeverity, LocationAnnouncement } from '../model/location.model';
import { AnnouncementDialogComponent } from '../ui/announcement-dialog';

@Component({
  selector: 'app-my-location-announcements',
  templateUrl: './my-location-announcements.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, Button, Tag, Toast, ConfirmDialog, AnnouncementDialogComponent],
  providers: [ConfirmationService, MessageService],
  host: { class: 'flex flex-col h-full min-h-0' },
})
export default class MyLocationAnnouncementsComponent {
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  readonly locationId = input.required<string>();
  readonly dialogVisible = signal(false);
  readonly editingAnnouncement = signal<LocationAnnouncement | null>(null);

  readonly announcements = computed(() => {
    const locId = this.locationId();
    if (!locId) return [];
    const loc = this.locationService.getById(locId);
    return [...(loc?.announcements ?? [])].sort(
      (a, b) => b.createdDate.localeCompare(a.createdDate),
    );
  });

  getSeverityTag(severity: AnnouncementSeverity): 'info' | 'warn' | 'success' {
    return severity;
  }

  onAdd(): void {
    this.editingAnnouncement.set(null);
    this.dialogVisible.set(true);
  }

  onEdit(item: LocationAnnouncement): void {
    this.editingAnnouncement.set(item);
    this.dialogVisible.set(true);
  }

  onSave(data: Omit<LocationAnnouncement, 'id' | 'createdDate'>): void {
    const locId = this.locationId();
    if (!locId) return;

    const existing = this.editingAnnouncement();
    if (existing) {
      this.locationService.updateAnnouncement(locId, { ...existing, ...data });
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('announcement.updateSuccess'),
        life: 3000,
      });
    } else {
      this.locationService.addAnnouncement(locId, {
        ...data,
        createdDate: new Date().toISOString().slice(0, 10),
      });
      this.messageService.add({
        severity: 'success',
        summary: this.transloco.translate('announcement.createSuccess'),
        life: 3000,
      });
    }
    this.dialogVisible.set(false);
  }

  onDelete(event: Event, item: LocationAnnouncement): void {
    const locId = this.locationId();
    if (!locId) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      header: this.transloco.translate('announcement.confirmDeleteTitle'),
      message: this.transloco.translate('announcement.confirmDelete', { name: item.title }),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.transloco.translate('announcement.dialog.delete'),
      rejectLabel: this.transloco.translate('announcement.dialog.cancel'),
      accept: () => {
        this.locationService.deleteAnnouncement(locId, item.id);
        this.messageService.add({
          severity: 'success',
          summary: this.transloco.translate('announcement.deleteSuccess'),
          life: 3000,
        });
      },
    });
  }
}
