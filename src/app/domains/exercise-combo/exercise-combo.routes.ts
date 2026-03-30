import { Routes } from '@angular/router';

export const exerciseComboRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/exercise-combo-page'),
  },
];
