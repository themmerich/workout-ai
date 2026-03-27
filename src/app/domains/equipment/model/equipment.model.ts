export type EquipmentCategory = 'mobility' | 'dumbbell' | 'barbell' | 'cardio' | 'cable' | 'machine' | 'bodyweight' | 'other';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  weight: number | null;
}

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  'mobility',
  'dumbbell',
  'barbell',
  'cardio',
  'cable',
  'machine',
  'bodyweight',
  'other',
];
