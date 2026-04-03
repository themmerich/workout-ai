export interface LocationEquipment {
  equipmentId: string;
  quantity: number;
  weight: number | null;
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

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const WEEKDAYS: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export interface OpeningHour {
  day: Weekday;
  open: string;
  close: string;
  closed: boolean;
}

export interface CalendarException {
  date: string; // YYYY-MM-DD
  open: string | null;
  close: string | null;
  closed: boolean;
  note: string;
}

export function defaultOpeningHours(): OpeningHour[] {
  return WEEKDAYS.map((day) => ({
    day,
    open: day === 'saturday' || day === 'sunday' ? '09:00' : '06:00',
    close: day === 'saturday' || day === 'sunday' ? '18:00' : '22:00',
    closed: false,
  }));
}

export interface BundeslandOption {
  code: string;
  name: string;
}

export const BUNDESLAENDER: BundeslandOption[] = [
  { code: 'BW', name: 'Baden-Württemberg' },
  { code: 'BY', name: 'Bayern' },
  { code: 'BE', name: 'Berlin' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hessen' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'NI', name: 'Niedersachsen' },
  { code: 'NW', name: 'Nordrhein-Westfalen' },
  { code: 'RP', name: 'Rheinland-Pfalz' },
  { code: 'SL', name: 'Saarland' },
  { code: 'SN', name: 'Sachsen' },
  { code: 'ST', name: 'Sachsen-Anhalt' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'TH', name: 'Thüringen' },
];

export type AnnouncementSeverity = 'info' | 'warn' | 'success';

export const ANNOUNCEMENT_SEVERITIES: AnnouncementSeverity[] = ['info', 'warn', 'success'];

export interface LocationAnnouncement {
  id: string;
  title: string;
  message: string;
  createdDate: string;
  severity: AnnouncementSeverity;
}

export interface Location {
  id: string;
  name: string;
  logo: LocationLogo;
  openingHours: OpeningHour[];
  calendarExceptions: CalendarException[];
  announcements: LocationAnnouncement[];
  bundesland: string;
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
