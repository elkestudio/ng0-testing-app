import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'about-us', loadComponent: () => import('./pages/about-us/about-us').then(m => m.AboutUsComponent) },
];
