export type GroupMemberRole = 'owner' | 'member';

export type InvitationStatus = 'pending' | 'accepted' | 'rejected';

export interface GroupMember {
  userId: string;
  role: GroupMemberRole;
  joinedDate: string;
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  invitedUserId: string;
  invitedByUserId: string;
  status: InvitationStatus;
  createdDate: string;
}

export interface TrainingGroup {
  id: string;
  name: string;
  logo: { color: string; imageUrl: string | null };
  members: GroupMember[];
  invitations: GroupInvitation[];
}
