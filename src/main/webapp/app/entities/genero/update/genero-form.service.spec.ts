import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../genero.test-samples';

import { GeneroFormService } from './genero-form.service';

describe('Genero Form Service', () => {
  let service: GeneroFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneroFormService);
  });

  describe('Service methods', () => {
    describe('createGeneroFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGeneroFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            genero: expect.any(Object),
          }),
        );
      });

      it('passing IGenero should create a new form with FormGroup', () => {
        const formGroup = service.createGeneroFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            genero: expect.any(Object),
          }),
        );
      });
    });

    describe('getGenero', () => {
      it('should return NewGenero for default Genero initial value', () => {
        const formGroup = service.createGeneroFormGroup(sampleWithNewData);

        const genero = service.getGenero(formGroup) as any;

        expect(genero).toMatchObject(sampleWithNewData);
      });

      it('should return NewGenero for empty Genero initial value', () => {
        const formGroup = service.createGeneroFormGroup();

        const genero = service.getGenero(formGroup) as any;

        expect(genero).toMatchObject({});
      });

      it('should return IGenero', () => {
        const formGroup = service.createGeneroFormGroup(sampleWithRequiredData);

        const genero = service.getGenero(formGroup) as any;

        expect(genero).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGenero should not enable id FormControl', () => {
        const formGroup = service.createGeneroFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGenero should disable id FormControl', () => {
        const formGroup = service.createGeneroFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
