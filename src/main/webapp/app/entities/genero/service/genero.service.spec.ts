import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGenero } from '../genero.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../genero.test-samples';

import { GeneroService } from './genero.service';

const requireRestSample: IGenero = {
  ...sampleWithRequiredData,
};

describe('Genero Service', () => {
  let service: GeneroService;
  let httpMock: HttpTestingController;
  let expectedResult: IGenero | IGenero[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GeneroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Genero', () => {
      const genero = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(genero).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Genero', () => {
      const genero = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(genero).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Genero', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Genero', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Genero', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGeneroToCollectionIfMissing', () => {
      it('should add a Genero to an empty array', () => {
        const genero: IGenero = sampleWithRequiredData;
        expectedResult = service.addGeneroToCollectionIfMissing([], genero);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(genero);
      });

      it('should not add a Genero to an array that contains it', () => {
        const genero: IGenero = sampleWithRequiredData;
        const generoCollection: IGenero[] = [
          {
            ...genero,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGeneroToCollectionIfMissing(generoCollection, genero);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Genero to an array that doesn't contain it", () => {
        const genero: IGenero = sampleWithRequiredData;
        const generoCollection: IGenero[] = [sampleWithPartialData];
        expectedResult = service.addGeneroToCollectionIfMissing(generoCollection, genero);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(genero);
      });

      it('should add only unique Genero to an array', () => {
        const generoArray: IGenero[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const generoCollection: IGenero[] = [sampleWithRequiredData];
        expectedResult = service.addGeneroToCollectionIfMissing(generoCollection, ...generoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const genero: IGenero = sampleWithRequiredData;
        const genero2: IGenero = sampleWithPartialData;
        expectedResult = service.addGeneroToCollectionIfMissing([], genero, genero2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(genero);
        expect(expectedResult).toContain(genero2);
      });

      it('should accept null and undefined values', () => {
        const genero: IGenero = sampleWithRequiredData;
        expectedResult = service.addGeneroToCollectionIfMissing([], null, genero, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(genero);
      });

      it('should return initial array if no Genero is added', () => {
        const generoCollection: IGenero[] = [sampleWithRequiredData];
        expectedResult = service.addGeneroToCollectionIfMissing(generoCollection, undefined, null);
        expect(expectedResult).toEqual(generoCollection);
      });
    });

    describe('compareGenero', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGenero(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 6830 };
        const entity2 = null;

        const compareResult1 = service.compareGenero(entity1, entity2);
        const compareResult2 = service.compareGenero(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 6830 };
        const entity2 = { id: 13171 };

        const compareResult1 = service.compareGenero(entity1, entity2);
        const compareResult2 = service.compareGenero(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 6830 };
        const entity2 = { id: 6830 };

        const compareResult1 = service.compareGenero(entity1, entity2);
        const compareResult2 = service.compareGenero(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
