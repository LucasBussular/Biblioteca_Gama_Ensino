import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGenero } from '../genero.model';
import { GeneroService } from '../service/genero.service';

const generoResolve = (route: ActivatedRouteSnapshot): Observable<null | IGenero> => {
  const id = route.params.id;
  if (id) {
    return inject(GeneroService)
      .find(id)
      .pipe(
        mergeMap((genero: HttpResponse<IGenero>) => {
          if (genero.body) {
            return of(genero.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default generoResolve;
