import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GeneroResolve from './route/genero-routing-resolve.service';

const generoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/genero.component').then(m => m.GeneroComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/genero-detail.component').then(m => m.GeneroDetailComponent),
    resolve: {
      genero: GeneroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/genero-update.component').then(m => m.GeneroUpdateComponent),
    resolve: {
      genero: GeneroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/genero-update.component').then(m => m.GeneroUpdateComponent),
    resolve: {
      genero: GeneroResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default generoRoute;
