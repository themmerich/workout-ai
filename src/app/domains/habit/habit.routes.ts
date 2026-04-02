import { Routes } from '@angular/router';

export const habitRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/habit-page'),
  },
];
