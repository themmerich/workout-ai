import { Routes } from '@angular/router';

export const workoutRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/workout-page'),
  },
];
