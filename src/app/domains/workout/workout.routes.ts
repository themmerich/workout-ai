import { Routes } from '@angular/router';

export const workoutRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'new', loadComponent: () => import('./feature/workout-new-page') },
  { path: 'list', loadComponent: () => import('./feature/workout-page') },
  { path: 'calendar', loadComponent: () => import('./feature/workout-calendar-page') },
  { path: 'progression', loadComponent: () => import('./feature/workout-progression-page') },
];

export const medalRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/medal-page'),
  },
];
