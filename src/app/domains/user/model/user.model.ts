export interface WeightEntry {
  date: string;
  weightKg: number;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: string;
  password?: string;
  heightCm?: number;
  birthDate?: string;
  weightHistory?: WeightEntry[];
}
