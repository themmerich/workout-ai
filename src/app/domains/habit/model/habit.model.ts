export type HabitType = 'checkbox' | 'number' | 'text';

export interface HabitCategory {
  id: string;
  name: string;
  sortOrder: number;
  active: boolean;
}

export interface Habit {
  id: string;
  name: string;
  categoryId: string;
  type: HabitType;
  unit?: string;
  scoreWeight: number;
  sortOrder: number;
  active: boolean;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // ISO date 'YYYY-MM-DD'
  checkValue?: boolean;
  numberValue?: number;
  textValue?: string;
}
