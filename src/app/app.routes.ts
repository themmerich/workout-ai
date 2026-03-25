import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'workouts',
    loadChildren: () => import('./domains/workout').then((m) => m.workoutRoutes),
  },
  {
    path: '',
    redirectTo: 'workouts',
    pathMatch: 'full',
  },
];
