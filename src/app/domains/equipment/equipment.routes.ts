import { Routes } from '@angular/router';

export const equipmentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/equipment-page'),
  },
];
