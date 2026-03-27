import { Routes } from '@angular/router';

export const exerciseRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/exercise-page'),
  },
];
