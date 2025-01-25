import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmprestimos, NewEmprestimos } from '../emprestimos.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmprestimos for edit and NewEmprestimosFormGroupInput for create.
 */
type EmprestimosFormGroupInput = IEmprestimos | PartialWithRequiredKeyOf<NewEmprestimos>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEmprestimos | NewEmprestimos> = Omit<T, 'dataEmprestimo' | 'dataDevolucao'> & {
  dataEmprestimo?: string | null;
  dataDevolucao?: string | null;
};

type EmprestimosFormRawValue = FormValueOf<IEmprestimos>;

type NewEmprestimosFormRawValue = FormValueOf<NewEmprestimos>;

type EmprestimosFormDefaults = Pick<NewEmprestimos, 'id' | 'dataEmprestimo' | 'dataDevolucao'>;

type EmprestimosFormGroupContent = {
  id: FormControl<EmprestimosFormRawValue['id'] | NewEmprestimos['id']>;
  dataEmprestimo: FormControl<EmprestimosFormRawValue['dataEmprestimo']>;
  dataDevolucao: FormControl<EmprestimosFormRawValue['dataDevolucao']>;
  status: FormControl<EmprestimosFormRawValue['status']>;
  livro: FormControl<EmprestimosFormRawValue['livro']>;
  cliente: FormControl<EmprestimosFormRawValue['cliente']>;
};

export type EmprestimosFormGroup = FormGroup<EmprestimosFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmprestimosFormService {
  createEmprestimosFormGroup(emprestimos: EmprestimosFormGroupInput = { id: null }): EmprestimosFormGroup {
    const emprestimosRawValue = this.convertEmprestimosToEmprestimosRawValue({
      ...this.getFormDefaults(),
      ...emprestimos,
    });
    return new FormGroup<EmprestimosFormGroupContent>({
      id: new FormControl(
        { value: emprestimosRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dataEmprestimo: new FormControl(emprestimosRawValue.dataEmprestimo, {
        validators: [Validators.required],
      }),
      dataDevolucao: new FormControl(emprestimosRawValue.dataDevolucao),
      status: new FormControl(emprestimosRawValue.status, {
        validators: [Validators.required],
      }),
      livro: new FormControl(emprestimosRawValue.livro),
      cliente: new FormControl(emprestimosRawValue.cliente),
    });
  }

  getEmprestimos(form: EmprestimosFormGroup): IEmprestimos | NewEmprestimos {
    return this.convertEmprestimosRawValueToEmprestimos(form.getRawValue() as EmprestimosFormRawValue | NewEmprestimosFormRawValue);
  }

  resetForm(form: EmprestimosFormGroup, emprestimos: EmprestimosFormGroupInput): void {
    const emprestimosRawValue = this.convertEmprestimosToEmprestimosRawValue({ ...this.getFormDefaults(), ...emprestimos });
    form.reset(
      {
        ...emprestimosRawValue,
        id: { value: emprestimosRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EmprestimosFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataEmprestimo: currentTime,
      dataDevolucao: currentTime,
    };
  }

  private convertEmprestimosRawValueToEmprestimos(
    rawEmprestimos: EmprestimosFormRawValue | NewEmprestimosFormRawValue,
  ): IEmprestimos | NewEmprestimos {
    return {
      ...rawEmprestimos,
      dataEmprestimo: dayjs(rawEmprestimos.dataEmprestimo, DATE_TIME_FORMAT),
      dataDevolucao: dayjs(rawEmprestimos.dataDevolucao, DATE_TIME_FORMAT),
    };
  }

  private convertEmprestimosToEmprestimosRawValue(
    emprestimos: IEmprestimos | (Partial<NewEmprestimos> & EmprestimosFormDefaults),
  ): EmprestimosFormRawValue | PartialWithRequiredKeyOf<NewEmprestimosFormRawValue> {
    return {
      ...emprestimos,
      dataEmprestimo: emprestimos.dataEmprestimo ? emprestimos.dataEmprestimo.format(DATE_TIME_FORMAT) : undefined,
      dataDevolucao: emprestimos.dataDevolucao ? emprestimos.dataDevolucao.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
