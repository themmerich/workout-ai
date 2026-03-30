export type Salutation = 'mr' | 'mrs' | 'diverse';

export const SALUTATIONS: Salutation[] = ['mr', 'mrs', 'diverse'];

export type Gender = 'male' | 'female' | 'diverse';

export const GENDERS: Gender[] = ['male', 'female', 'diverse'];

export interface WeightEntry {
  date: string;
  weightKg: number;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
  salutation?: Salutation;
  gender?: Gender;
  birthDate?: string;
  heightCm?: number;
  phone?: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
  weightHistory?: WeightEntry[];
}
