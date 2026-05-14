import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./screens/home/home.component').then(m => m.HomeComponent) },
  { path: 'about-us', loadComponent: () => import('./screens/about-us/about-us.component').then(m => m.AboutUsComponent) },
];
