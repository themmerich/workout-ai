import { Routes } from '@angular/router';

export const medalRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/medal-page'),
  },
];
