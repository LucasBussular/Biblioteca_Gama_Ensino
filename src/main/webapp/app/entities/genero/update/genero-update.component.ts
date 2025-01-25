import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGenero } from '../genero.model';
import { GeneroService } from '../service/genero.service';
import { GeneroFormGroup, GeneroFormService } from './genero-form.service';

@Component({
  selector: 'jhi-genero-update',
  templateUrl: './genero-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GeneroUpdateComponent implements OnInit {
  isSaving = false;
  genero: IGenero | null = null;

  protected generoService = inject(GeneroService);
  protected generoFormService = inject(GeneroFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GeneroFormGroup = this.generoFormService.createGeneroFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ genero }) => {
      this.genero = genero;
      if (genero) {
        this.updateForm(genero);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const genero = this.generoFormService.getGenero(this.editForm);
    if (genero.id !== null) {
      this.subscribeToSaveResponse(this.generoService.update(genero));
    } else {
      this.subscribeToSaveResponse(this.generoService.create(genero));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGenero>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(genero: IGenero): void {
    this.genero = genero;
    this.generoFormService.resetForm(this.editForm, genero);
  }
}
