export interface LocationEquipment {
  equipmentId: string;
  quantity: number;
}

export type LocationMemberRole = 'owner' | 'trainer' | 'member';

export const LOCATION_MEMBER_ROLES: LocationMemberRole[] = ['owner', 'trainer', 'member'];

export interface LocationMember {
  userId: string;
  role: LocationMemberRole;
  password: string;
}

export interface LocationLogo {
  color: string;
  imageUrl: string | null;
}

export const LOGO_COLORS: string[] = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

export interface Location {
  id: string;
  name: string;
  logo: LocationLogo;
  street: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  equipment: LocationEquipment[];
  members: LocationMember[];
}
