export type UserRole = 'admin' | 'user';

export interface AppUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  locationId: string | null;
  locationName: string | null;
  locationRole: string | null;
}
