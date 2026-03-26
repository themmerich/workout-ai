import { UserProfile } from '../model';

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    username: 'admin',
    displayName: 'Max Mustermann',
    email: 'max@example.com',
    role: 'admin',
  },
  {
    id: '2',
    username: 'jdoe',
    displayName: 'Jane Doe',
    email: 'jane@example.com',
    role: 'user',
  },
  {
    id: '3',
    username: 'bsmith',
    displayName: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
  },
];
