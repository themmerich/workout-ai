import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature').then((m) => m.SettingsPageComponent),
  },
];
