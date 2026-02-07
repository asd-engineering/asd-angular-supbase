import { Routes } from '@angular/router'

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup').then((m) => m.Signup),
  },
  {
    path: 'callback',
    loadComponent: () => import('./callback/callback').then((m) => m.Callback),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
]
