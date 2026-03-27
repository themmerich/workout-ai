import { Routes } from '@angular/router';

export const locationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/location-page'),
  },
];
