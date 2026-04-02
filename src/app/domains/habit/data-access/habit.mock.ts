import { Habit, HabitCategory, HabitEntry } from '../model/habit.model';

export const MOCK_CATEGORIES: HabitCategory[] = [
  { id: '1', name: 'Regeneration', sortOrder: 1, active: true },
  { id: '2', name: 'Supplements', sortOrder: 2, active: true },
  { id: '3', name: 'Trinken', sortOrder: 3, active: true },
  { id: '4', name: 'Essen', sortOrder: 4, active: true },
  { id: '5', name: 'Routinen', sortOrder: 5, active: true },
  { id: '6', name: 'Mobility', sortOrder: 6, active: true },
  { id: '7', name: 'Conditioning', sortOrder: 7, active: true },
  { id: '8', name: 'Krafttraining', sortOrder: 8, active: true },
  { id: '9', name: 'Glücklich werden', sortOrder: 9, active: true },
];

export const MOCK_HABITS: Habit[] = [
  // Regeneration
  { id: '1', name: 'Schlafdauer', categoryId: '1', type: 'text', scoreWeight: 1, sortOrder: 1, active: true },
  { id: '2', name: 'Schlafqualität (1-10)', categoryId: '1', type: 'number', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '3', name: 'Massage', categoryId: '1', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '4', name: 'Retention / NP', categoryId: '1', type: 'checkbox', scoreWeight: 1, sortOrder: 4, active: true },

  // Supplements
  { id: '5', name: 'Vitamin C + Zink', categoryId: '2', type: 'checkbox', scoreWeight: 1, sortOrder: 1, active: true },
  { id: '6', name: 'Multivitamin', categoryId: '2', type: 'checkbox', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '7', name: 'Vitamin D', categoryId: '2', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '8', name: 'Omega 3', categoryId: '2', type: 'checkbox', scoreWeight: 1, sortOrder: 4, active: true },
  { id: '9', name: 'Magnesium', categoryId: '2', type: 'checkbox', scoreWeight: 1, sortOrder: 5, active: true },

  // Trinken
  { id: '10', name: '1l vor 12 Uhr', categoryId: '3', type: 'checkbox', scoreWeight: 1, sortOrder: 1, active: true },
  { id: '11', name: 'Wasser 1l (1)', categoryId: '3', type: 'checkbox', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '12', name: 'Wasser 1l (2)', categoryId: '3', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '13', name: 'Wasser 1l (3)', categoryId: '3', type: 'checkbox', scoreWeight: 1, sortOrder: 4, active: true },

  // Essen
  { id: '14', name: 'Eiweißreich 40', categoryId: '4', type: 'checkbox', scoreWeight: 1, sortOrder: 1, active: true },
  { id: '15', name: 'Eiweißreich 80', categoryId: '4', type: 'checkbox', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '16', name: 'Eiweißreich 120', categoryId: '4', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '17', name: 'Kaffee 90min nach Aufstehen', categoryId: '4', type: 'checkbox', scoreWeight: 1, sortOrder: 4, active: true },
  { id: '18', name: 'Green Smoothy', categoryId: '4', type: 'checkbox', scoreWeight: 1, sortOrder: 5, active: true },
  { id: '19', name: 'Essen tracken', categoryId: '4', type: 'checkbox', scoreWeight: 1, sortOrder: 6, active: true },
  { id: '20', name: 'Kaloriendefizit', categoryId: '4', type: 'number', unit: 'kcal', scoreWeight: 1, sortOrder: 7, active: true },

  // Routinen
  { id: '21', name: 'Wasser morgens', categoryId: '5', type: 'checkbox', scoreWeight: 1, sortOrder: 1, active: true },
  { id: '22', name: 'Meditation morgens', categoryId: '5', type: 'checkbox', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '23', name: 'Spaziergang', categoryId: '5', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '24', name: 'Spaziergang 2', categoryId: '5', type: 'checkbox', scoreWeight: 1, sortOrder: 4, active: true },
  { id: '25', name: 'Meditation abends', categoryId: '5', type: 'checkbox', scoreWeight: 1, sortOrder: 5, active: true },
  { id: '26', name: 'Aktivitätskalorien 500', categoryId: '5', type: 'checkbox', scoreWeight: 1, sortOrder: 6, active: true },
  { id: '27', name: 'Aktivitätskalorien 800', categoryId: '5', type: 'checkbox', scoreWeight: 2, sortOrder: 7, active: true },
  { id: '28', name: 'Aktivitätskalorien 1000', categoryId: '5', type: 'checkbox', scoreWeight: 3, sortOrder: 8, active: true },

  // Mobility
  { id: '29', name: 'Füße rollen', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 1, active: true },
  { id: '30', name: 'Zehen Beugung', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '31', name: 'Zehen Streckung', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '32', name: 'Waden rollen', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 4, active: true },
  { id: '33', name: 'Squat', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 5, active: true },
  { id: '34', name: 'Snatch', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 6, active: true },
  { id: '35', name: 'BWS rollen / halten', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 7, active: true },
  { id: '36', name: 'Schultern stretchen', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 8, active: true },
  { id: '37', name: 'Hängen', categoryId: '6', type: 'checkbox', scoreWeight: 1, sortOrder: 9, active: true },

  // Conditioning
  { id: '38', name: 'Laufen', categoryId: '7', type: 'text', scoreWeight: 2, sortOrder: 1, active: true },
  { id: '39', name: 'Seilspringen', categoryId: '7', type: 'text', scoreWeight: 2, sortOrder: 2, active: true },
  { id: '40', name: 'Rudern', categoryId: '7', type: 'text', scoreWeight: 2, sortOrder: 3, active: true },
  { id: '41', name: 'Airbike', categoryId: '7', type: 'text', scoreWeight: 2, sortOrder: 4, active: true },

  // Krafttraining
  { id: '42', name: 'Beine', categoryId: '8', type: 'checkbox', scoreWeight: 2, sortOrder: 1, active: true },
  { id: '43', name: 'Core', categoryId: '8', type: 'checkbox', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '44', name: 'unterer Rücken', categoryId: '8', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '45', name: 'Rücken', categoryId: '8', type: 'checkbox', scoreWeight: 2, sortOrder: 4, active: true },
  { id: '46', name: 'Brust', categoryId: '8', type: 'checkbox', scoreWeight: 2, sortOrder: 5, active: true },
  { id: '47', name: 'Schultern', categoryId: '8', type: 'checkbox', scoreWeight: 2, sortOrder: 6, active: true },
  { id: '48', name: 'Trizeps', categoryId: '8', type: 'checkbox', scoreWeight: 1, sortOrder: 7, active: true },

  // Glücklich werden
  { id: '49', name: 'OOF', categoryId: '9', type: 'checkbox', scoreWeight: 1, sortOrder: 1, active: true },
  { id: '50', name: 'Sport machen / Baustelle', categoryId: '9', type: 'checkbox', scoreWeight: 1, sortOrder: 2, active: true },
  { id: '51', name: 'Körperpflege / Rasur', categoryId: '9', type: 'checkbox', scoreWeight: 1, sortOrder: 3, active: true },
  { id: '52', name: 'Baden / Duschen', categoryId: '9', type: 'checkbox', scoreWeight: 1, sortOrder: 4, active: true },
];

// Sample entries for the week of 2026-03-30 to 2026-04-05
let entryId = 1;

function entry(habitId: string, date: string, value: { check?: boolean; num?: number; text?: string }): HabitEntry {
  return {
    id: String(entryId++),
    habitId,
    date,
    ...(value.check !== undefined ? { checkValue: value.check } : {}),
    ...(value.num !== undefined ? { numberValue: value.num } : {}),
    ...(value.text !== undefined ? { textValue: value.text } : {}),
  };
}

export const MOCK_ENTRIES: HabitEntry[] = [
  // Monday 2026-03-30
  entry('1', '2026-03-30', { text: '07:30' }),
  entry('2', '2026-03-30', { num: 8 }),
  entry('4', '2026-03-30', { check: true }),
  entry('5', '2026-03-30', { check: true }),
  entry('6', '2026-03-30', { check: true }),
  entry('7', '2026-03-30', { check: true }),
  entry('9', '2026-03-30', { check: true }),
  entry('10', '2026-03-30', { check: true }),
  entry('11', '2026-03-30', { check: true }),
  entry('12', '2026-03-30', { check: true }),
  entry('14', '2026-03-30', { check: true }),
  entry('15', '2026-03-30', { check: true }),
  entry('19', '2026-03-30', { check: true }),
  entry('20', '2026-03-30', { num: 618 }),
  entry('21', '2026-03-30', { check: true }),
  entry('23', '2026-03-30', { check: true }),
  entry('26', '2026-03-30', { check: true }),
  entry('49', '2026-03-30', { check: true }),
  entry('50', '2026-03-30', { check: true }),
  entry('52', '2026-03-30', { check: true }),

  // Tuesday 2026-03-31
  entry('1', '2026-03-31', { text: '06:58' }),
  entry('2', '2026-03-31', { num: 7 }),
  entry('5', '2026-03-31', { check: true }),
  entry('6', '2026-03-31', { check: true }),
  entry('7', '2026-03-31', { check: true }),
  entry('9', '2026-03-31', { check: true }),
  entry('10', '2026-03-31', { check: true }),
  entry('11', '2026-03-31', { check: true }),
  entry('14', '2026-03-31', { check: true }),
  entry('15', '2026-03-31', { check: true }),
  entry('19', '2026-03-31', { check: true }),
  entry('20', '2026-03-31', { num: 325 }),
  entry('21', '2026-03-31', { check: true }),
  entry('26', '2026-03-31', { check: true }),
  entry('38', '2026-03-31', { text: '40min' }),
  entry('44', '2026-03-31', { check: true }),
  entry('50', '2026-03-31', { check: true }),
  entry('52', '2026-03-31', { check: true }),

  // Wednesday 2026-04-01
  entry('1', '2026-04-01', { text: '07:10' }),
  entry('2', '2026-04-01', { num: 8 }),
  entry('4', '2026-04-01', { check: true }),
  entry('5', '2026-04-01', { check: true }),
  entry('11', '2026-04-01', { check: true }),
  entry('14', '2026-04-01', { check: true }),
  entry('15', '2026-04-01', { check: true }),
  entry('19', '2026-04-01', { check: true }),
  entry('21', '2026-04-01', { check: true }),
  entry('23', '2026-04-01', { check: true }),
  entry('26', '2026-04-01', { check: true }),
  entry('49', '2026-04-01', { check: true }),
  entry('52', '2026-04-01', { check: true }),

  // Thursday 2026-04-02 (today)
  entry('1', '2026-04-02', { text: '07:19' }),
  entry('2', '2026-04-02', { num: 7 }),
  entry('5', '2026-04-02', { check: true }),
  entry('6', '2026-04-02', { check: true }),
  entry('7', '2026-04-02', { check: true }),
  entry('9', '2026-04-02', { check: true }),
  entry('10', '2026-04-02', { check: true }),
  entry('11', '2026-04-02', { check: true }),
  entry('14', '2026-04-02', { check: true }),
  entry('19', '2026-04-02', { check: true }),
  entry('21', '2026-04-02', { check: true }),
  entry('23', '2026-04-02', { check: true }),
  entry('26', '2026-04-02', { check: true }),
  entry('45', '2026-04-02', { check: true }),
  entry('46', '2026-04-02', { check: true }),
  entry('47', '2026-04-02', { check: true }),
  entry('49', '2026-04-02', { check: true }),
  entry('51', '2026-04-02', { check: true }),
];
