import { Routes } from '@angular/router';

export const locationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/location-page'),
  },
];

export const myLocationRoutes: Routes = [
  { path: '', loadComponent: () => import('./feature/my-location-details') },
  { path: 'members', loadComponent: () => import('./feature/my-location-members') },
  { path: 'equipment', loadComponent: () => import('./feature/my-location-equipment') },
  { path: 'announcements', loadComponent: () => import('./feature/my-location-announcements') },
  { path: 'calendar', loadComponent: () => import('./feature/my-location-calendar') },
];
