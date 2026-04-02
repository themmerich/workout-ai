import { Routes } from '@angular/router';

export const workoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/workout-page'),
  },
];

export const medalRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/medal-page'),
  },
];
