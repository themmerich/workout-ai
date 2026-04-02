import { Routes } from '@angular/router';

export const exerciseRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/exercise-page'),
  },
];

export const exerciseComboRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/exercise-combo-page'),
  },
];
