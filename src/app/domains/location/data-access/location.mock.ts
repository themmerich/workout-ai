import { defaultOpeningHours, Location } from '../model/location.model';

export const MOCK_LOCATIONS: Location[] = [
  {
    id: '1', name: 'FitX München Zentrum', logo: { color: '#ef4444', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [],
    announcements: [
      { id: '1', title: 'Geänderte Öffnungszeiten an Ostern', message: 'Karfreitag: 08:00 – 16:00 Uhr, Ostermontag: geschlossen. Ab Dienstag wieder reguläre Öffnungszeiten.', createdDate: '2026-04-01', severity: 'warn' },
      { id: '2', title: 'Neuer Kursplan ab Mai', message: 'Ab 01. Mai gelten neue Kurszeiten. Den aktuellen Plan findet ihr an der Theke.', createdDate: '2026-03-28', severity: 'info' },
    ],
    bundesland: 'BY', street: 'Karlsplatz 12', zip: '80335', city: 'München',
    country: 'DE', phone: '+49 89 1234567', email: 'muenchen@fitx.de', website: 'https://www.fitx.de',
    equipment: [
      { equipmentId: '1', quantity: 6, weight: 5 }, { equipmentId: '1', quantity: 6, weight: 10 },
      { equipmentId: '7', quantity: 2, weight: 20 }, { equipmentId: '9', quantity: 5, weight: null },
      { equipmentId: '11', quantity: 3, weight: null }, { equipmentId: '13', quantity: 2, weight: null },
      { equipmentId: '15', quantity: 2, weight: null }, { equipmentId: '16', quantity: 1, weight: null },
      { equipmentId: '17', quantity: 1, weight: null }, { equipmentId: '19', quantity: 6, weight: null },
      { equipmentId: '21', quantity: 10, weight: null },
    ],
    members: [
      { userId: '12', role: 'owner', password: 'mklein' }, { userId: '13', role: 'trainer', password: 'dschmidt' },
      { userId: '2', role: 'member', password: 'jdoe' }, { userId: '4', role: 'member', password: 'amueller' }, { userId: '5', role: 'member', password: 'tweber' },
    ],
  },
  {
    id: '2', name: 'McFIT Berlin Mitte', logo: { color: '#f97316', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'BE', street: 'Alexanderplatz 5', zip: '10178', city: 'Berlin',
    country: 'DE', phone: '+49 30 9876543', email: 'berlin@mcfit.com', website: 'https://www.mcfit.com',
    equipment: [
      { equipmentId: '1', quantity: 6, weight: 8 }, { equipmentId: '1', quantity: 6, weight: 12 }, { equipmentId: '1', quantity: 6, weight: 20 },
      { equipmentId: '7', quantity: 3, weight: 20 }, { equipmentId: '9', quantity: 8, weight: null }, { equipmentId: '10', quantity: 4, weight: null },
      { equipmentId: '12', quantity: 4, weight: null }, { equipmentId: '13', quantity: 2, weight: null }, { equipmentId: '15', quantity: 3, weight: null },
      { equipmentId: '18', quantity: 2, weight: null }, { equipmentId: '22', quantity: 2, weight: null }, { equipmentId: '23', quantity: 1, weight: null },
    ],
    members: [
      { userId: '14', role: 'owner', password: 'lbraun' }, { userId: '3', role: 'trainer', password: 'bsmith' }, { userId: '7', role: 'trainer', password: 'mfischer' },
      { userId: '2', role: 'member', password: 'jdoe' }, { userId: '8', role: 'member', password: 'swagner' },
    ],
  },
  {
    id: '3', name: 'Gold\'s Gym Hamburg', logo: { color: '#eab308', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'HH', street: 'Reeperbahn 42', zip: '20359', city: 'Hamburg',
    country: 'DE', phone: '+49 40 5551234', email: 'hamburg@goldsgym.de', website: 'https://www.goldsgym.de',
    equipment: [
      { equipmentId: '1', quantity: 8, weight: 5 }, { equipmentId: '1', quantity: 8, weight: 10 }, { equipmentId: '1', quantity: 8, weight: 15 },
      { equipmentId: '1', quantity: 8, weight: 20 }, { equipmentId: '1', quantity: 8, weight: 25 }, { equipmentId: '1', quantity: 8, weight: 30 },
      { equipmentId: '7', quantity: 4, weight: 20 }, { equipmentId: '8', quantity: 2, weight: 10 },
      { equipmentId: '13', quantity: 3, weight: null }, { equipmentId: '14', quantity: 2, weight: null }, { equipmentId: '22', quantity: 3, weight: null },
      { equipmentId: '23', quantity: 2, weight: null }, { equipmentId: '24', quantity: 8, weight: null },
    ],
    members: [
      { userId: '15', role: 'owner', password: 'fkrause' }, { userId: '17', role: 'trainer', password: 'sschulz' },
      { userId: '3', role: 'member', password: 'bsmith' }, { userId: '5', role: 'member', password: 'tweber' }, { userId: '9', role: 'member', password: 'phoffmann' },
      { userId: '10', role: 'member', password: 'kbauer' },
    ],
  },
  {
    id: '4', name: 'Clever Fit Köln', logo: { color: '#22c55e', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'NW', street: 'Hohenzollernring 88', zip: '50672', city: 'Köln',
    country: 'DE', phone: '+49 221 4443210', email: 'koeln@clever-fit.com', website: 'https://www.clever-fit.com',
    equipment: [
      { equipmentId: '1', quantity: 4, weight: 8 }, { equipmentId: '1', quantity: 4, weight: 12 },
      { equipmentId: '9', quantity: 6, weight: null }, { equipmentId: '11', quantity: 4, weight: null },
      { equipmentId: '12', quantity: 4, weight: null }, { equipmentId: '15', quantity: 2, weight: null },
      { equipmentId: '16', quantity: 1, weight: null }, { equipmentId: '17', quantity: 1, weight: null }, { equipmentId: '20', quantity: 3, weight: null },
    ],
    members: [
      { userId: '4', role: 'owner', password: 'amueller' }, { userId: '7', role: 'member', password: 'mfischer' },
    ],
  },
  {
    id: '5', name: 'John Reed Frankfurt', logo: { color: '#6366f1', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'HE', street: 'Zeil 15', zip: '60313', city: 'Frankfurt am Main',
    country: 'DE', phone: '+49 69 7778899', email: 'frankfurt@johnreed.fitness', website: 'https://www.johnreed.fitness',
    equipment: [
      { equipmentId: '1', quantity: 6, weight: 5 }, { equipmentId: '1', quantity: 6, weight: 15 },
      { equipmentId: '7', quantity: 3, weight: 20 }, { equipmentId: '9', quantity: 4, weight: null }, { equipmentId: '10', quantity: 3, weight: null },
      { equipmentId: '13', quantity: 2, weight: null }, { equipmentId: '15', quantity: 2, weight: null },
      { equipmentId: '19', quantity: 8, weight: null }, { equipmentId: '21', quantity: 12, weight: null },
    ],
    members: [
      { userId: '3', role: 'owner', password: 'bsmith' }, { userId: '18', role: 'trainer', password: 'jneumann' }, { userId: '8', role: 'member', password: 'swagner' },
    ],
  },
  {
    id: '6', name: 'Urban Sports Club Stuttgart', logo: { color: '#14b8a6', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'BW', street: 'Königstraße 30', zip: '70173', city: 'Stuttgart',
    country: 'DE', phone: '+49 711 6665544', email: 'stuttgart@urbansportsclub.com', website: 'https://www.urbansportsclub.com',
    equipment: [
      { equipmentId: '19', quantity: 10, weight: null }, { equipmentId: '20', quantity: 5, weight: null }, { equipmentId: '21', quantity: 15, weight: null },
      { equipmentId: '9', quantity: 3, weight: null }, { equipmentId: '11', quantity: 2, weight: null },
    ],
    members: [
      { userId: '5', role: 'owner', password: 'tweber' }, { userId: '2', role: 'member', password: 'jdoe' }, { userId: '10', role: 'member', password: 'kbauer' },
    ],
  },
  {
    id: '7', name: 'CrossFit Box Düsseldorf', logo: { color: '#8b5cf6', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'NW', street: 'Friedrichstraße 7', zip: '40217', city: 'Düsseldorf',
    country: 'DE', phone: '+49 211 3332211', email: 'duesseldorf@crossfit.de', website: 'https://www.crossfit.de',
    equipment: [
      { equipmentId: '7', quantity: 6, weight: 20 }, { equipmentId: '22', quantity: 4, weight: null }, { equipmentId: '23', quantity: 3, weight: null },
      { equipmentId: '24', quantity: 12, weight: null }, { equipmentId: '10', quantity: 4, weight: null }, { equipmentId: '20', quantity: 4, weight: null },
    ],
    members: [
      { userId: '7', role: 'owner', password: 'mfischer' }, { userId: '19', role: 'member', password: 'thaas' }, { userId: '4', role: 'member', password: 'amueller' },
    ],
  },
  {
    id: '8', name: 'Fitness First Nürnberg', logo: { color: '#3b82f6', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'BY', street: 'Breite Gasse 22', zip: '90402', city: 'Nürnberg',
    country: 'DE', phone: '+49 911 2221100', email: 'nuernberg@fitnessfirst.de', website: 'https://www.fitnessfirst.de',
    equipment: [
      { equipmentId: '1', quantity: 5, weight: 5 }, { equipmentId: '1', quantity: 5, weight: 10 }, { equipmentId: '1', quantity: 5, weight: 15 },
      { equipmentId: '7', quantity: 2, weight: 20 }, { equipmentId: '9', quantity: 6, weight: null }, { equipmentId: '13', quantity: 2, weight: null },
      { equipmentId: '15', quantity: 2, weight: null }, { equipmentId: '17', quantity: 1, weight: null }, { equipmentId: '18', quantity: 1, weight: null },
    ],
    members: [
      { userId: '8', role: 'owner', password: 'swagner' }, { userId: '3', role: 'trainer', password: 'bsmith' }, { userId: '9', role: 'member', password: 'phoffmann' },
    ],
  },
  {
    id: '9', name: 'FitStar Leipzig', logo: { color: '#ec4899', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'SN', street: 'Augustusplatz 3', zip: '04109', city: 'Leipzig',
    country: 'DE', phone: '+49 341 8889900', email: 'leipzig@fitstar.de', website: 'https://www.fitstar.de',
    equipment: [
      { equipmentId: '1', quantity: 4, weight: 8 }, { equipmentId: '1', quantity: 4, weight: 12 },
      { equipmentId: '9', quantity: 5, weight: null }, { equipmentId: '12', quantity: 3, weight: null },
      { equipmentId: '15', quantity: 2, weight: null }, { equipmentId: '21', quantity: 8, weight: null },
    ],
    members: [
      { userId: '9', role: 'owner', password: 'phoffmann' }, { userId: '20', role: 'trainer', password: 'ckoch' },
    ],
  },
  {
    id: '10', name: 'Bodystreet Dresden', logo: { color: '#06b6d4', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'SN', street: 'Prager Straße 10', zip: '01069', city: 'Dresden',
    country: 'DE', phone: '+49 351 4445566', email: 'dresden@bodystreet.com', website: 'https://www.bodystreet.com',
    equipment: [
      { equipmentId: '19', quantity: 4, weight: null }, { equipmentId: '20', quantity: 6, weight: null }, { equipmentId: '21', quantity: 8, weight: null },
    ],
    members: [
      { userId: '10', role: 'owner', password: 'kbauer' },
    ],
  },
  {
    id: '11', name: 'Körperschmiede Schweinfurt', logo: { color: '#eab308', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'BY', street: 'Schultesstraße 15', zip: '97421', city: 'Schweinfurt',
    country: 'DE', phone: '+49 9721 8877665', email: 'info@koerperschmiede-sw.de', website: 'https://www.koerperschmiede-sw.de',
    equipment: [
      { equipmentId: '1', quantity: 8, weight: 5 }, { equipmentId: '1', quantity: 8, weight: 10 }, { equipmentId: '1', quantity: 8, weight: 15 },
      { equipmentId: '1', quantity: 6, weight: 20 }, { equipmentId: '1', quantity: 4, weight: 25 }, { equipmentId: '1', quantity: 4, weight: 30 },
      { equipmentId: '7', quantity: 4, weight: 20 }, { equipmentId: '8', quantity: 2, weight: 10 },
      { equipmentId: '9', quantity: 4, weight: null }, { equipmentId: '10', quantity: 2, weight: null }, { equipmentId: '11', quantity: 3, weight: null }, { equipmentId: '12', quantity: 2, weight: null },
      { equipmentId: '13', quantity: 3, weight: null }, { equipmentId: '14', quantity: 1, weight: null },
      { equipmentId: '15', quantity: 2, weight: null }, { equipmentId: '16', quantity: 1, weight: null }, { equipmentId: '17', quantity: 2, weight: null }, { equipmentId: '18', quantity: 1, weight: null },
      { equipmentId: '19', quantity: 6, weight: null }, { equipmentId: '20', quantity: 8, weight: null }, { equipmentId: '21', quantity: 10, weight: null },
      { equipmentId: '22', quantity: 1, weight: null }, { equipmentId: '23', quantity: 1, weight: null }, { equipmentId: '24', quantity: 6, weight: null },
    ],
    members: [
      { userId: '26', role: 'owner', password: 'themmerich' },
      { userId: '27', role: 'trainer', password: 'svogt' },
      { userId: '28', role: 'member', password: 'mstein' },
      { userId: '29', role: 'member', password: 'jlang' },
      { userId: '30', role: 'member', password: 'pmaier' },
      { userId: '31', role: 'member', password: 'hemm' },
    ],
  },
  {
    id: '12', name: 'Home Gym Hemmerich', logo: { color: '#6366f1', imageUrl: null }, openingHours: defaultOpeningHours(), calendarExceptions: [], announcements: [], bundesland: 'BY', street: 'Am Garten 7', zip: '97424', city: 'Schweinfurt',
    country: 'DE', phone: '', email: '', website: '',
    equipment: [
      { equipmentId: '1', quantity: 2, weight: 10 }, { equipmentId: '1', quantity: 2, weight: 15 }, { equipmentId: '1', quantity: 2, weight: 20 },
      { equipmentId: '7', quantity: 1, weight: 20 }, { equipmentId: '22', quantity: 1, weight: null },
      { equipmentId: '20', quantity: 3, weight: null }, { equipmentId: '24', quantity: 2, weight: null },
    ],
    members: [
      { userId: '31', role: 'owner', password: 'hemm' },
    ],
  },
];
