import { Routes } from '@angular/router';
import { adminGuard } from './core/auth/admin.guard';
import { authGuard } from './core/auth/auth.guard';
import { locationMemberGuard } from './core/auth/location-member.guard';
import { ownerGuard } from './core/auth/owner.guard';
import { LayoutComponent } from './core/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./core/login/login-page'),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./domains/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'user',
        canActivate: [adminGuard],
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
        path: 'exercise-combos',
        canActivate: [adminGuard],
        loadChildren: () =>
          import('./domains/exercise/exercise.routes').then(
            (m) => m.exerciseComboRoutes,
          ),
      },
      {
        path: 'workouts',
        canActivate: [locationMemberGuard],
        loadChildren: () =>
          import('./domains/workout/workout.routes').then((m) => m.workoutRoutes),
      },
      {
        path: 'medals',
        canActivate: [locationMemberGuard],
        loadChildren: () =>
          import('./domains/workout/workout.routes').then((m) => m.medalRoutes),
      },
      {
        path: 'training-groups',
        canActivate: [locationMemberGuard],
        loadChildren: () =>
          import('./domains/training-group/training-group.routes').then(
            (m) => m.trainingGroupRoutes,
          ),
      },
      {
        path: 'habits',
        canActivate: [locationMemberGuard],
        loadChildren: () =>
          import('./domains/habit/habit.routes').then((m) => m.habitRoutes),
      },
      {
        path: 'my-location',
        canActivate: [locationMemberGuard],
        loadChildren: () => import('./domains/location/location.routes').then((m) => m.myLocationDetailsRoutes),
      },
      {
        path: 'my-members',
        canActivate: [ownerGuard],
        loadChildren: () => import('./domains/location/location.routes').then((m) => m.myLocationMembersRoutes),
      },
      {
        path: 'my-equipment',
        canActivate: [ownerGuard],
        loadChildren: () => import('./domains/location/location.routes').then((m) => m.myLocationEquipmentRoutes),
      },
      {
        path: 'my-announcements',
        canActivate: [ownerGuard],
        loadChildren: () => import('./domains/location/location.routes').then((m) => m.myLocationAnnouncementsRoutes),
      },
      {
        path: 'my-calendar',
        canActivate: [locationMemberGuard],
        loadChildren: () => import('./domains/location/location.routes').then((m) => m.myLocationCalendarRoutes),
      },
      {
        path: 'profile',
        loadComponent: () => import('./domains/user/feature/profile-page'),
      },
      {
        path: 'weight',
        loadComponent: () => import('./domains/user/feature/weight-page'),
      },
      {
        path: 'settings',
        canActivate: [adminGuard],
        loadChildren: () => import('./domains/settings/settings.routes').then((m) => m.settingsRoutes),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./core/not-found/not-found-page'),
  },
];
