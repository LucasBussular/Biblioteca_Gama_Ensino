import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'bibliotecagamanovaApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'cliente',
    data: { pageTitle: 'bibliotecagamanovaApp.cliente.home.title' },
    loadChildren: () => import('./cliente/cliente.routes'),
  },
  {
    path: 'emprestimos',
    data: { pageTitle: 'bibliotecagamanovaApp.emprestimos.home.title' },
    loadChildren: () => import('./emprestimos/emprestimos.routes'),
  },
  {
    path: 'genero',
    data: { pageTitle: 'bibliotecagamanovaApp.genero.home.title' },
    loadChildren: () => import('./genero/genero.routes'),
  },
  {
    path: 'livro',
    data: { pageTitle: 'bibliotecagamanovaApp.livro.home.title' },
    loadChildren: () => import('./livro/livro.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
