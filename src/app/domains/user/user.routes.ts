import { Routes } from '@angular/router';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature').then((m) => m.UserPageComponent),
  },
];
