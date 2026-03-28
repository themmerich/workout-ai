import { Location } from '../model/location.model';

export const MOCK_LOCATIONS: Location[] = [
  {
    id: '1', name: 'FitX München Zentrum', logo: { color: '#ef4444', imageUrl: null }, street: 'Karlsplatz 12', zip: '80335', city: 'München',
    country: 'Deutschland', phone: '+49 89 1234567', email: 'muenchen@fitx.de', website: 'https://www.fitx.de',
    equipment: [
      { equipmentId: '1', quantity: 4 }, { equipmentId: '2', quantity: 4 }, { equipmentId: '3', quantity: 4 },
      { equipmentId: '7', quantity: 2 }, { equipmentId: '9', quantity: 5 }, { equipmentId: '11', quantity: 3 },
      { equipmentId: '13', quantity: 2 }, { equipmentId: '15', quantity: 2 }, { equipmentId: '16', quantity: 1 },
      { equipmentId: '17', quantity: 1 }, { equipmentId: '19', quantity: 6 }, { equipmentId: '21', quantity: 10 },
    ],
    members: [
      { userId: '1', role: 'owner', password: 'admin' }, { userId: '6', role: 'trainer', password: 'lschneider' },
      { userId: '2', role: 'member', password: 'jdoe' }, { userId: '4', role: 'member', password: 'amueller' }, { userId: '5', role: 'member', password: 'tweber' },
    ],
  },
  {
    id: '2', name: 'McFIT Berlin Mitte', logo: { color: '#f97316', imageUrl: null }, street: 'Alexanderplatz 5', zip: '10178', city: 'Berlin',
    country: 'Deutschland', phone: '+49 30 9876543', email: 'berlin@mcfit.com', website: 'https://www.mcfit.com',
    equipment: [
      { equipmentId: '1', quantity: 6 }, { equipmentId: '3', quantity: 6 }, { equipmentId: '5', quantity: 6 },
      { equipmentId: '7', quantity: 3 }, { equipmentId: '9', quantity: 8 }, { equipmentId: '10', quantity: 4 },
      { equipmentId: '12', quantity: 4 }, { equipmentId: '13', quantity: 2 }, { equipmentId: '15', quantity: 3 },
      { equipmentId: '18', quantity: 2 }, { equipmentId: '22', quantity: 2 }, { equipmentId: '23', quantity: 1 },
    ],
    members: [
      { userId: '1', role: 'owner', password: 'admin' }, { userId: '3', role: 'trainer', password: 'bsmith' }, { userId: '7', role: 'trainer', password: 'mfischer' },
      { userId: '2', role: 'member', password: 'jdoe' }, { userId: '8', role: 'member', password: 'swagner' },
    ],
  },
  {
    id: '3', name: 'Gold\'s Gym Hamburg', logo: { color: '#eab308', imageUrl: null }, street: 'Reeperbahn 42', zip: '20359', city: 'Hamburg',
    country: 'Deutschland', phone: '+49 40 5551234', email: 'hamburg@goldsgym.de', website: 'https://www.goldsgym.de',
    equipment: [
      { equipmentId: '1', quantity: 8 }, { equipmentId: '2', quantity: 8 }, { equipmentId: '3', quantity: 8 },
      { equipmentId: '4', quantity: 8 }, { equipmentId: '5', quantity: 8 }, { equipmentId: '6', quantity: 8 },
      { equipmentId: '7', quantity: 4 }, { equipmentId: '8', quantity: 2 }, { equipmentId: '13', quantity: 3 },
      { equipmentId: '14', quantity: 2 }, { equipmentId: '22', quantity: 3 }, { equipmentId: '23', quantity: 2 },
      { equipmentId: '24', quantity: 4 }, { equipmentId: '25', quantity: 4 },
    ],
    members: [
      { userId: '6', role: 'owner', password: 'lschneider' }, { userId: '1', role: 'trainer', password: 'admin' },
      { userId: '3', role: 'member', password: 'bsmith' }, { userId: '5', role: 'member', password: 'tweber' }, { userId: '9', role: 'member', password: 'phoffmann' },
      { userId: '10', role: 'member', password: 'kbauer' },
    ],
  },
  {
    id: '4', name: 'Clever Fit Köln', logo: { color: '#22c55e', imageUrl: null }, street: 'Hohenzollernring 88', zip: '50672', city: 'Köln',
    country: 'Deutschland', phone: '+49 221 4443210', email: 'koeln@clever-fit.com', website: 'https://www.clever-fit.com',
    equipment: [
      { equipmentId: '1', quantity: 4 }, { equipmentId: '3', quantity: 4 }, { equipmentId: '9', quantity: 6 },
      { equipmentId: '11', quantity: 4 }, { equipmentId: '12', quantity: 4 }, { equipmentId: '15', quantity: 2 },
      { equipmentId: '16', quantity: 1 }, { equipmentId: '17', quantity: 1 }, { equipmentId: '20', quantity: 3 },
    ],
    members: [
      { userId: '4', role: 'owner', password: 'amueller' }, { userId: '7', role: 'member', password: 'mfischer' },
    ],
  },
  {
    id: '5', name: 'John Reed Frankfurt', logo: { color: '#6366f1', imageUrl: null }, street: 'Zeil 15', zip: '60313', city: 'Frankfurt am Main',
    country: 'Deutschland', phone: '+49 69 7778899', email: 'frankfurt@johnreed.fitness', website: 'https://www.johnreed.fitness',
    equipment: [
      { equipmentId: '1', quantity: 6 }, { equipmentId: '2', quantity: 6 }, { equipmentId: '7', quantity: 3 },
      { equipmentId: '9', quantity: 4 }, { equipmentId: '10', quantity: 3 }, { equipmentId: '13', quantity: 2 },
      { equipmentId: '15', quantity: 2 }, { equipmentId: '19', quantity: 8 }, { equipmentId: '21', quantity: 12 },
    ],
    members: [
      { userId: '3', role: 'owner', password: 'bsmith' }, { userId: '6', role: 'trainer', password: 'lschneider' }, { userId: '8', role: 'member', password: 'swagner' },
    ],
  },
  {
    id: '6', name: 'Urban Sports Club Stuttgart', logo: { color: '#14b8a6', imageUrl: null }, street: 'Königstraße 30', zip: '70173', city: 'Stuttgart',
    country: 'Deutschland', phone: '+49 711 6665544', email: 'stuttgart@urbansportsclub.com', website: 'https://www.urbansportsclub.com',
    equipment: [
      { equipmentId: '19', quantity: 10 }, { equipmentId: '20', quantity: 5 }, { equipmentId: '21', quantity: 15 },
      { equipmentId: '9', quantity: 3 }, { equipmentId: '11', quantity: 2 },
    ],
    members: [
      { userId: '5', role: 'owner', password: 'tweber' }, { userId: '2', role: 'member', password: 'jdoe' }, { userId: '10', role: 'member', password: 'kbauer' },
    ],
  },
  {
    id: '7', name: 'CrossFit Box Düsseldorf', logo: { color: '#8b5cf6', imageUrl: null }, street: 'Friedrichstraße 7', zip: '40217', city: 'Düsseldorf',
    country: 'Deutschland', phone: '+49 211 3332211', email: 'duesseldorf@crossfit.de', website: 'https://www.crossfit.de',
    equipment: [
      { equipmentId: '7', quantity: 6 }, { equipmentId: '22', quantity: 4 }, { equipmentId: '23', quantity: 3 },
      { equipmentId: '24', quantity: 6 }, { equipmentId: '25', quantity: 6 }, { equipmentId: '10', quantity: 4 },
      { equipmentId: '20', quantity: 4 },
    ],
    members: [
      { userId: '7', role: 'owner', password: 'mfischer' }, { userId: '1', role: 'member', password: 'admin' }, { userId: '4', role: 'member', password: 'amueller' },
    ],
  },
  {
    id: '8', name: 'Fitness First Nürnberg', logo: { color: '#3b82f6', imageUrl: null }, street: 'Breite Gasse 22', zip: '90402', city: 'Nürnberg',
    country: 'Deutschland', phone: '+49 911 2221100', email: 'nuernberg@fitnessfirst.de', website: 'https://www.fitnessfirst.de',
    equipment: [
      { equipmentId: '1', quantity: 5 }, { equipmentId: '3', quantity: 5 }, { equipmentId: '5', quantity: 5 },
      { equipmentId: '7', quantity: 2 }, { equipmentId: '9', quantity: 6 }, { equipmentId: '13', quantity: 2 },
      { equipmentId: '15', quantity: 2 }, { equipmentId: '17', quantity: 1 }, { equipmentId: '18', quantity: 1 },
    ],
    members: [
      { userId: '8', role: 'owner', password: 'swagner' }, { userId: '3', role: 'trainer', password: 'bsmith' }, { userId: '9', role: 'member', password: 'phoffmann' },
    ],
  },
  {
    id: '9', name: 'FitStar Leipzig', logo: { color: '#ec4899', imageUrl: null }, street: 'Augustusplatz 3', zip: '04109', city: 'Leipzig',
    country: 'Deutschland', phone: '+49 341 8889900', email: 'leipzig@fitstar.de', website: 'https://www.fitstar.de',
    equipment: [
      { equipmentId: '1', quantity: 4 }, { equipmentId: '2', quantity: 4 }, { equipmentId: '9', quantity: 5 },
      { equipmentId: '12', quantity: 3 }, { equipmentId: '15', quantity: 2 }, { equipmentId: '21', quantity: 8 },
    ],
    members: [
      { userId: '9', role: 'owner', password: 'phoffmann' }, { userId: '6', role: 'trainer', password: 'lschneider' },
    ],
  },
  {
    id: '10', name: 'Bodystreet Dresden', logo: { color: '#06b6d4', imageUrl: null }, street: 'Prager Straße 10', zip: '01069', city: 'Dresden',
    country: 'Deutschland', phone: '+49 351 4445566', email: 'dresden@bodystreet.com', website: 'https://www.bodystreet.com',
    equipment: [
      { equipmentId: '19', quantity: 4 }, { equipmentId: '20', quantity: 6 }, { equipmentId: '21', quantity: 8 },
    ],
    members: [
      { userId: '10', role: 'owner', password: 'kbauer' },
    ],
  },
];
