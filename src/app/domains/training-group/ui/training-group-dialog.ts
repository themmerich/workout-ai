import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../../core/auth/auth.service';
import { UserService } from '../../user/data-access/user.service';
import { LOGO_COLORS } from '../../location/model/location.model';
import { LocationLogoComponent } from '../../location/ui/location-logo';
import { TrainingGroupService } from '../data-access/training-group.service';
import { TrainingGroup } from '../model/training-group.model';

@Component({
  selector: 'app-training-group-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonModule,
    Dialog,
    FloatLabel,
    InputText,
    Select,
    Tag,
    Toast,
    LocationLogoComponent,
  ],
  templateUrl: './training-group-dialog.html',
})
export class TrainingGroupDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly groupService = inject(TrainingGroupService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  readonly visible = input(false);
  readonly group = input<TrainingGroup | null>(null);
  readonly groupSaved = output<TrainingGroup | Omit<TrainingGroup, 'id'>>();
  readonly dialogClosed = output<void>();

  protected readonly logoColors = LOGO_COLORS;
  protected readonly logoColor = signal(LOGO_COLORS[0]);
  protected readonly logoImageUrl = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
  });

  protected readonly inviteUserId = signal<string | null>(null);

  private readonly liveGroup = computed(() => {
    const g = this.group();
    return g ? this.groupService.getById(g.id) ?? g : null;
  });

  protected readonly availableUsers = computed(() => {
    const g = this.liveGroup();
    if (!g) return [];
    const memberIds = new Set(g.members.map((m) => m.userId));
    const pendingIds = new Set(g.invitations.filter((i) => i.status === 'pending').map((i) => i.invitedUserId));
    return this.userService
      .getAll()
      .filter((u) => u.role !== 'admin' && !memberIds.has(u.id) && !pendingIds.has(u.id))
      .map((u) => ({ label: `${u.firstName} ${u.lastName}`, value: u.id }));
  });

  protected readonly pendingInvitations = computed(() => {
    const g = this.liveGroup();
    if (!g) return [];
    return g.invitations
      .filter((i) => i.status === 'pending')
      .map((i) => {
        const user = this.userService.getById(i.invitedUserId);
        return { ...i, userName: user ? `${user.firstName} ${user.lastName}` : i.invitedUserId };
      });
  });

  protected readonly memberList = computed(() => {
    const g = this.liveGroup();
    if (!g) return [];
    return g.members.map((m) => {
      const user = this.userService.getById(m.userId);
      return {
        ...m,
        userName: user ? `${user.firstName} ${user.lastName}` : m.userId,
      };
    });
  });

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const data = this.group();
      if (!isVisible) return;
      if (data) {
        this.form.patchValue({ name: data.name });
        this.logoColor.set(data.logo.color);
        this.logoImageUrl.set(data.logo.imageUrl);
      } else {
        this.form.reset({ name: '' });
        this.logoColor.set(LOGO_COLORS[0]);
        this.logoImageUrl.set(null);
      }
      this.inviteUserId.set(null);
    });
  }

  protected onLogoColorChange(color: string): void {
    this.logoColor.set(color);
    this.form.markAsDirty();
  }

  protected onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoImageUrl.set(reader.result as string);
        this.form.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  protected onLogoImageRemove(): void {
    this.logoImageUrl.set(null);
    this.form.markAsDirty();
  }

  protected onInviteUser(): void {
    const userId = this.inviteUserId();
    const g = this.group();
    const currentUser = this.authService.currentUser();
    if (!userId || !g || !currentUser) return;

    this.groupService.invite(g.id, userId, currentUser.id);
    this.inviteUserId.set(null);
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('trainingGroup.dialog.inviteSent'),
      life: 3000,
    });
  }

  protected onCancelInvitation(invitationId: string): void {
    const g = this.group();
    if (!g) return;
    this.groupService.cancelInvitation(g.id, invitationId);
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      const data = this.group();
      const currentUser = this.authService.currentUser();

      const result = {
        name: formValue.name,
        logo: { color: this.logoColor(), imageUrl: this.logoImageUrl() },
        members: data?.members ?? [
          { userId: currentUser!.id, role: 'owner' as const, joinedDate: new Date().toISOString().substring(0, 10) },
        ],
        invitations: data?.invitations ?? [],
      };

      if (data) {
        this.groupSaved.emit({ id: data.id, ...result });
      } else {
        this.groupSaved.emit(result);
      }
    }
  }
}
