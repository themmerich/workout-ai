import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';
import { LayoutComponent } from './core/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./domains/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'user',
        loadChildren: () => import('./domains/user/user.routes').then((m) => m.userRoutes),
      },
      {
        path: 'locations',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./domains/location/location.routes').then((m) => m.locationRoutes),
      },
      {
        path: 'equipment',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./domains/equipment/equipment.routes').then((m) => m.equipmentRoutes),
      },
      {
        path: 'exercises',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./domains/exercise/exercise.routes').then((m) => m.exerciseRoutes),
      },
      {
        path: 'settings',
        canActivate: [adminGuard],
        loadChildren: () => import('./domains/settings/settings.routes').then((m) => m.settingsRoutes),
      },
    ],
  },
];
