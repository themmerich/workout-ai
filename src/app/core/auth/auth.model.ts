export type UserRole = 'admin' | 'user';

export interface UserLocationMembership {
  locationId: string;
  locationName: string;
  locationRole: string; // 'owner' | 'trainer' | 'member'
}

export interface AppUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  locations: UserLocationMembership[];
}
