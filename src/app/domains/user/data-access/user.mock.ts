import { UserProfile } from '../model/user.model';

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
  {
    id: '4',
    username: 'amueller',
    displayName: 'Anna Müller',
    email: 'anna.mueller@example.com',
    role: 'user',
  },
  {
    id: '5',
    username: 'tweber',
    displayName: 'Thomas Weber',
    email: 'thomas.weber@example.com',
    role: 'user',
  },
  {
    id: '6',
    username: 'lschneider',
    displayName: 'Laura Schneider',
    email: 'laura.schneider@example.com',
    role: 'admin',
  },
  {
    id: '7',
    username: 'mfischer',
    displayName: 'Michael Fischer',
    email: 'michael.fischer@example.com',
    role: 'user',
  },
  {
    id: '8',
    username: 'swagner',
    displayName: 'Sophie Wagner',
    email: 'sophie.wagner@example.com',
    role: 'user',
  },
];
