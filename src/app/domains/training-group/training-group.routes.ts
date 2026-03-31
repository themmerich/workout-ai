import { Routes } from '@angular/router';

export const trainingGroupRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/training-group-page'),
  },
];
