import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGenero, NewGenero } from '../genero.model';

export type PartialUpdateGenero = Partial<IGenero> & Pick<IGenero, 'id'>;

export type EntityResponseType = HttpResponse<IGenero>;
export type EntityArrayResponseType = HttpResponse<IGenero[]>;

@Injectable({ providedIn: 'root' })
export class GeneroService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/generos');

  create(genero: NewGenero): Observable<EntityResponseType> {
    return this.http.post<IGenero>(this.resourceUrl, genero, { observe: 'response' });
  }

  update(genero: IGenero): Observable<EntityResponseType> {
    return this.http.put<IGenero>(`${this.resourceUrl}/${this.getGeneroIdentifier(genero)}`, genero, { observe: 'response' });
  }

  partialUpdate(genero: PartialUpdateGenero): Observable<EntityResponseType> {
    return this.http.patch<IGenero>(`${this.resourceUrl}/${this.getGeneroIdentifier(genero)}`, genero, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGenero>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGenero[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGeneroIdentifier(genero: Pick<IGenero, 'id'>): number {
    return genero.id;
  }

  compareGenero(o1: Pick<IGenero, 'id'> | null, o2: Pick<IGenero, 'id'> | null): boolean {
    return o1 && o2 ? this.getGeneroIdentifier(o1) === this.getGeneroIdentifier(o2) : o1 === o2;
  }

  addGeneroToCollectionIfMissing<Type extends Pick<IGenero, 'id'>>(
    generoCollection: Type[],
    ...generosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const generos: Type[] = generosToCheck.filter(isPresent);
    if (generos.length > 0) {
      const generoCollectionIdentifiers = generoCollection.map(generoItem => this.getGeneroIdentifier(generoItem));
      const generosToAdd = generos.filter(generoItem => {
        const generoIdentifier = this.getGeneroIdentifier(generoItem);
        if (generoCollectionIdentifiers.includes(generoIdentifier)) {
          return false;
        }
        generoCollectionIdentifiers.push(generoIdentifier);
        return true;
      });
      return [...generosToAdd, ...generoCollection];
    }
    return generoCollection;
  }
}
