import { Routes } from '@angular/router'

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings').then((m) => m.Settings),
      },
    ],
  },
]
