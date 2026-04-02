import { Routes } from '@angular/router';

export const locationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/location-page'),
  },
];

export const myLocationDetailsRoutes: Routes = [
  { path: '', loadComponent: () => import('./feature/my-location-details') },
];

export const myLocationMembersRoutes: Routes = [
  { path: '', loadComponent: () => import('./feature/my-location-members') },
];

export const myLocationEquipmentRoutes: Routes = [
  { path: '', loadComponent: () => import('./feature/my-location-equipment') },
];

export const myLocationCalendarRoutes: Routes = [
  { path: '', loadComponent: () => import('./feature/my-location-calendar') },
];
