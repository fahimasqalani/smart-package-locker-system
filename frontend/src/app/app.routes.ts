import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'lockers',
    loadComponent: () =>
      import('./features/lockers/lockers.component').then(m => m.LockersComponent),
  },
  {
    path: 'delivery',
    loadComponent: () =>
      import('./features/delivery/delivery.component').then(m => m.DeliveryComponent),
  },
  {
    path: 'pickup',
    loadComponent: () =>
      import('./features/pickup/pickup.component').then(m => m.PickupComponent),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./features/history/history.component').then(m => m.HistoryComponent),
  },
];
