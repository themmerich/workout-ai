import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ThemeService } from '../theme/theme.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../../domains/user/data-access/user.service';
import { TrainingGroupService } from '../../domains/training-group/data-access/training-group.service';
import { LocationLogoComponent } from '../../domains/location/ui/location-logo';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [TranslocoDirective, ButtonModule, Popover, Toast, LocationLogoComponent],
  templateUrl: './header.html',
})
export class HeaderComponent {
  protected readonly themeService = inject(ThemeService);
  private readonly transloco = inject(TranslocoService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly groupService = inject(TrainingGroupService);
  private readonly messageService = inject(MessageService);
  readonly toggleSidebar = output<void>();

  protected readonly langLabel = computed(() => {
    const lang = this.transloco.getActiveLang();
    return lang.toUpperCase();
  });

  protected readonly pendingInvitations = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.groupService.getPendingInvitations(user.id).map((item) => {
      const inviter = this.userService.getById(item.invitation.invitedByUserId);
      return {
        ...item,
        inviterName: inviter ? `${inviter.firstName} ${inviter.lastName}` : item.invitation.invitedByUserId,
      };
    });
  });

  protected toggleLanguage(): void {
    const current = this.transloco.getActiveLang();
    this.transloco.setActiveLang(current === 'de' ? 'en' : 'de');
  }

  protected onAcceptInvitation(groupId: string, invitationId: string): void {
    this.groupService.acceptInvitation(groupId, invitationId);
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('dashboard.invitations.accepted'),
      life: 3000,
    });
  }

  protected onRejectInvitation(groupId: string, invitationId: string): void {
    this.groupService.rejectInvitation(groupId, invitationId);
    this.messageService.add({
      severity: 'info',
      summary: this.transloco.translate('dashboard.invitations.rejected'),
      life: 3000,
    });
  }
}
