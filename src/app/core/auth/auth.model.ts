export type UserRole = 'admin' | 'user';

export interface AppUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  locationId: string | null;
  locationName: string | null;
}
