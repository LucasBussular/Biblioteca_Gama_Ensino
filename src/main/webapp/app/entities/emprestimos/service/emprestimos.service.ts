import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmprestimos, NewEmprestimos } from '../emprestimos.model';

export type PartialUpdateEmprestimos = Partial<IEmprestimos> & Pick<IEmprestimos, 'id'>;

type RestOf<T extends IEmprestimos | NewEmprestimos> = Omit<T, 'dataEmprestimo' | 'dataDevolucao'> & {
  dataEmprestimo?: string | null;
  dataDevolucao?: string | null;
};

export type RestEmprestimos = RestOf<IEmprestimos>;

export type NewRestEmprestimos = RestOf<NewEmprestimos>;

export type PartialUpdateRestEmprestimos = RestOf<PartialUpdateEmprestimos>;

export type EntityResponseType = HttpResponse<IEmprestimos>;
export type EntityArrayResponseType = HttpResponse<IEmprestimos[]>;

@Injectable({ providedIn: 'root' })
export class EmprestimosService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emprestimos');

  create(emprestimos: NewEmprestimos): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emprestimos);
    return this.http
      .post<RestEmprestimos>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(emprestimos: IEmprestimos): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emprestimos);
    return this.http
      .put<RestEmprestimos>(`${this.resourceUrl}/${this.getEmprestimosIdentifier(emprestimos)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(emprestimos: PartialUpdateEmprestimos): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emprestimos);
    return this.http
      .patch<RestEmprestimos>(`${this.resourceUrl}/${this.getEmprestimosIdentifier(emprestimos)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEmprestimos>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEmprestimos[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmprestimosIdentifier(emprestimos: Pick<IEmprestimos, 'id'>): number {
    return emprestimos.id;
  }

  compareEmprestimos(o1: Pick<IEmprestimos, 'id'> | null, o2: Pick<IEmprestimos, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmprestimosIdentifier(o1) === this.getEmprestimosIdentifier(o2) : o1 === o2;
  }

  addEmprestimosToCollectionIfMissing<Type extends Pick<IEmprestimos, 'id'>>(
    emprestimosCollection: Type[],
    ...emprestimosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emprestimos: Type[] = emprestimosToCheck.filter(isPresent);
    if (emprestimos.length > 0) {
      const emprestimosCollectionIdentifiers = emprestimosCollection.map(emprestimosItem => this.getEmprestimosIdentifier(emprestimosItem));
      const emprestimosToAdd = emprestimos.filter(emprestimosItem => {
        const emprestimosIdentifier = this.getEmprestimosIdentifier(emprestimosItem);
        if (emprestimosCollectionIdentifiers.includes(emprestimosIdentifier)) {
          return false;
        }
        emprestimosCollectionIdentifiers.push(emprestimosIdentifier);
        return true;
      });
      return [...emprestimosToAdd, ...emprestimosCollection];
    }
    return emprestimosCollection;
  }

  protected convertDateFromClient<T extends IEmprestimos | NewEmprestimos | PartialUpdateEmprestimos>(emprestimos: T): RestOf<T> {
    return {
      ...emprestimos,
      dataEmprestimo: emprestimos.dataEmprestimo?.toJSON() ?? null,
      dataDevolucao: emprestimos.dataDevolucao?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEmprestimos: RestEmprestimos): IEmprestimos {
    return {
      ...restEmprestimos,
      dataEmprestimo: restEmprestimos.dataEmprestimo ? dayjs(restEmprestimos.dataEmprestimo) : undefined,
      dataDevolucao: restEmprestimos.dataDevolucao ? dayjs(restEmprestimos.dataDevolucao) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEmprestimos>): HttpResponse<IEmprestimos> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEmprestimos[]>): HttpResponse<IEmprestimos[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
