import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EmprestimosResolve from './route/emprestimos-routing-resolve.service';

const emprestimosRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/emprestimos.component').then(m => m.EmprestimosComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/emprestimos-detail.component').then(m => m.EmprestimosDetailComponent),
    resolve: {
      emprestimos: EmprestimosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/emprestimos-update.component').then(m => m.EmprestimosUpdateComponent),
    resolve: {
      emprestimos: EmprestimosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/emprestimos-update.component').then(m => m.EmprestimosUpdateComponent),
    resolve: {
      emprestimos: EmprestimosResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default emprestimosRoute;
