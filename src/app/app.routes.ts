import { Routes } from '@angular/router';
import { adminGuard } from './core/auth';
import { LayoutComponent } from './core/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./domains/dashboard').then((m) => m.dashboardRoutes),
      },
      {
        path: 'user',
        loadChildren: () => import('./domains/user').then((m) => m.userRoutes),
      },
      {
        path: 'settings',
        canActivate: [adminGuard],
        loadChildren: () => import('./domains/settings').then((m) => m.settingsRoutes),
      },
    ],
  },
];
