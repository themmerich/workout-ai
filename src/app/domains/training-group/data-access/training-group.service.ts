import { Injectable, signal } from '@angular/core';
import { generateId } from '../../../shared/utils/id-generator';
import { TrainingGroup, GroupInvitation } from '../model/training-group.model';
import { MOCK_TRAINING_GROUPS } from './training-group.mock';

@Injectable({ providedIn: 'root' })
export class TrainingGroupService {
  readonly trainingGroups = signal<TrainingGroup[]>(MOCK_TRAINING_GROUPS);

  getById(id: string): TrainingGroup | undefined {
    return this.trainingGroups().find((g) => g.id === id);
  }

  getByUserId(userId: string): TrainingGroup[] {
    return this.trainingGroups().filter((g) => g.members.some((m) => m.userId === userId));
  }

  add(item: Omit<TrainingGroup, 'id'>): void {
    const id = generateId(this.trainingGroups());
    this.trainingGroups.update((groups) => [...groups, { ...item, id }]);
  }

  update(item: TrainingGroup): void {
    this.trainingGroups.update((groups) => groups.map((g) => (g.id === item.id ? item : g)));
  }

  delete(id: string): void {
    this.trainingGroups.update((groups) => groups.filter((g) => g.id !== id));
  }

  invite(groupId: string, invitedUserId: string, invitedByUserId: string): void {
    this.trainingGroups.update((groups) =>
      groups.map((g) => {
        if (g.id !== groupId) return g;
        const invitation: GroupInvitation = {
          id: `inv-${Date.now()}`,
          groupId,
          invitedUserId,
          invitedByUserId,
          status: 'pending',
          createdDate: new Date().toISOString().substring(0, 10),
        };
        return { ...g, invitations: [...g.invitations, invitation] };
      }),
    );
  }

  acceptInvitation(groupId: string, invitationId: string): void {
    this.trainingGroups.update((groups) =>
      groups.map((g) => {
        if (g.id !== groupId) return g;
        const invitation = g.invitations.find((i) => i.id === invitationId);
        if (!invitation) return g;
        return {
          ...g,
          members: [
            ...g.members,
            {
              userId: invitation.invitedUserId,
              role: 'member' as const,
              joinedDate: new Date().toISOString().substring(0, 10),
            },
          ],
          invitations: g.invitations.map((i) =>
            i.id === invitationId ? { ...i, status: 'accepted' as const } : i,
          ),
        };
      }),
    );
  }

  rejectInvitation(groupId: string, invitationId: string): void {
    this.trainingGroups.update((groups) =>
      groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          invitations: g.invitations.map((i) =>
            i.id === invitationId ? { ...i, status: 'rejected' as const } : i,
          ),
        };
      }),
    );
  }

  cancelInvitation(groupId: string, invitationId: string): void {
    this.trainingGroups.update((groups) =>
      groups.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          invitations: g.invitations.filter((i) => i.id !== invitationId),
        };
      }),
    );
  }

  getPendingInvitations(userId: string): { invitation: GroupInvitation; group: TrainingGroup }[] {
    const result: { invitation: GroupInvitation; group: TrainingGroup }[] = [];
    for (const group of this.trainingGroups()) {
      for (const inv of group.invitations) {
        if (inv.invitedUserId === userId && inv.status === 'pending') {
          result.push({ invitation: inv, group });
        }
      }
    }
    return result;
  }
}
