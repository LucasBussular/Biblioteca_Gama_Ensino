import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../emprestimos.test-samples';

import { EmprestimosFormService } from './emprestimos-form.service';

describe('Emprestimos Form Service', () => {
  let service: EmprestimosFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmprestimosFormService);
  });

  describe('Service methods', () => {
    describe('createEmprestimosFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEmprestimosFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataEmprestimo: expect.any(Object),
            dataDevolucao: expect.any(Object),
            status: expect.any(Object),
            livro: expect.any(Object),
            cliente: expect.any(Object),
          }),
        );
      });

      it('passing IEmprestimos should create a new form with FormGroup', () => {
        const formGroup = service.createEmprestimosFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataEmprestimo: expect.any(Object),
            dataDevolucao: expect.any(Object),
            status: expect.any(Object),
            livro: expect.any(Object),
            cliente: expect.any(Object),
          }),
        );
      });
    });

    describe('getEmprestimos', () => {
      it('should return NewEmprestimos for default Emprestimos initial value', () => {
        const formGroup = service.createEmprestimosFormGroup(sampleWithNewData);

        const emprestimos = service.getEmprestimos(formGroup) as any;

        expect(emprestimos).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmprestimos for empty Emprestimos initial value', () => {
        const formGroup = service.createEmprestimosFormGroup();

        const emprestimos = service.getEmprestimos(formGroup) as any;

        expect(emprestimos).toMatchObject({});
      });

      it('should return IEmprestimos', () => {
        const formGroup = service.createEmprestimosFormGroup(sampleWithRequiredData);

        const emprestimos = service.getEmprestimos(formGroup) as any;

        expect(emprestimos).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEmprestimos should not enable id FormControl', () => {
        const formGroup = service.createEmprestimosFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEmprestimos should disable id FormControl', () => {
        const formGroup = service.createEmprestimosFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
