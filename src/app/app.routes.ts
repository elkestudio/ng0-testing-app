import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    children: [
    { path: 'child', title: 'Child Route' }
    ]
  },
];
