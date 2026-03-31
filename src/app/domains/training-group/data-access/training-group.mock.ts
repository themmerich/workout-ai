import { TrainingGroup } from '../model/training-group.model';

export const MOCK_TRAINING_GROUPS: TrainingGroup[] = [
  {
    id: '1',
    name: 'Schweinfurt Crew',
    logo: { color: '#22c55e', imageUrl: null },
    members: [
      { userId: '31', role: 'owner', joinedDate: '2026-02-01' },
      { userId: '26', role: 'member', joinedDate: '2026-02-03' },
      { userId: '28', role: 'member', joinedDate: '2026-02-05' },
    ],
    invitations: [
      {
        id: 'inv-1',
        groupId: '1',
        invitedUserId: '29',
        invitedByUserId: '31',
        status: 'pending',
        createdDate: '2026-03-28',
      },
    ],
  },
  {
    id: '2',
    name: 'Lauftreff Bayern',
    logo: { color: '#3b82f6', imageUrl: null },
    members: [
      { userId: '31', role: 'owner', joinedDate: '2026-03-01' },
      { userId: '5', role: 'member', joinedDate: '2026-03-05' },
    ],
    invitations: [],
  },
  {
    id: '3',
    name: 'Gym Bros',
    logo: { color: '#ef4444', imageUrl: null },
    members: [
      { userId: '2', role: 'owner', joinedDate: '2026-01-15' },
      { userId: '3', role: 'member', joinedDate: '2026-01-20' },
    ],
    invitations: [
      {
        id: 'inv-2',
        groupId: '3',
        invitedUserId: '31',
        invitedByUserId: '2',
        status: 'pending',
        createdDate: '2026-03-30',
      },
    ],
  },
];
