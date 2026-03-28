export interface LocationEquipment {
  equipmentId: string;
  quantity: number;
}

export type LocationMemberRole = 'owner' | 'trainer' | 'member';

export const LOCATION_MEMBER_ROLES: LocationMemberRole[] = ['owner', 'trainer', 'member'];

export interface LocationMember {
  userId: string;
  role: LocationMemberRole;
}

export interface Location {
  id: string;
  name: string;
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
