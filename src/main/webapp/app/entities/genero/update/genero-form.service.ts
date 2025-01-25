import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IGenero, NewGenero } from '../genero.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGenero for edit and NewGeneroFormGroupInput for create.
 */
type GeneroFormGroupInput = IGenero | PartialWithRequiredKeyOf<NewGenero>;

type GeneroFormDefaults = Pick<NewGenero, 'id'>;

type GeneroFormGroupContent = {
  id: FormControl<IGenero['id'] | NewGenero['id']>;
  genero: FormControl<IGenero['genero']>;
};

export type GeneroFormGroup = FormGroup<GeneroFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GeneroFormService {
  createGeneroFormGroup(genero: GeneroFormGroupInput = { id: null }): GeneroFormGroup {
    const generoRawValue = {
      ...this.getFormDefaults(),
      ...genero,
    };
    return new FormGroup<GeneroFormGroupContent>({
      id: new FormControl(
        { value: generoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      genero: new FormControl(generoRawValue.genero, {
        validators: [Validators.required],
      }),
    });
  }

  getGenero(form: GeneroFormGroup): IGenero | NewGenero {
    return form.getRawValue() as IGenero | NewGenero;
  }

  resetForm(form: GeneroFormGroup, genero: GeneroFormGroupInput): void {
    const generoRawValue = { ...this.getFormDefaults(), ...genero };
    form.reset(
      {
        ...generoRawValue,
        id: { value: generoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GeneroFormDefaults {
    return {
      id: null,
    };
  }
}
