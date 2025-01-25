import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmprestimos } from '../emprestimos.model';
import { EmprestimosService } from '../service/emprestimos.service';

const emprestimosResolve = (route: ActivatedRouteSnapshot): Observable<null | IEmprestimos> => {
  const id = route.params.id;
  if (id) {
    return inject(EmprestimosService)
      .find(id)
      .pipe(
        mergeMap((emprestimos: HttpResponse<IEmprestimos>) => {
          if (emprestimos.body) {
            return of(emprestimos.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default emprestimosResolve;
