import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ILivro } from 'app/entities/livro/livro.model';
import { LivroService } from 'app/entities/livro/service/livro.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { Status } from 'app/entities/enumerations/status.model';
import { EmprestimosService } from '../service/emprestimos.service';
import { IEmprestimos } from '../emprestimos.model';
import { EmprestimosFormGroup, EmprestimosFormService } from './emprestimos-form.service';

@Component({
  selector: 'jhi-emprestimos-update',
  templateUrl: './emprestimos-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EmprestimosUpdateComponent implements OnInit {
  isSaving = false;
  emprestimos: IEmprestimos | null = null;
  statusValues = Object.keys(Status);

  livrosSharedCollection: ILivro[] = [];
  clientesSharedCollection: ICliente[] = [];

  protected emprestimosService = inject(EmprestimosService);
  protected emprestimosFormService = inject(EmprestimosFormService);
  protected livroService = inject(LivroService);
  protected clienteService = inject(ClienteService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EmprestimosFormGroup = this.emprestimosFormService.createEmprestimosFormGroup();

  compareLivro = (o1: ILivro | null, o2: ILivro | null): boolean => this.livroService.compareLivro(o1, o2);

  compareCliente = (o1: ICliente | null, o2: ICliente | null): boolean => this.clienteService.compareCliente(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emprestimos }) => {
      this.emprestimos = emprestimos;
      if (emprestimos) {
        this.updateForm(emprestimos);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emprestimos = this.emprestimosFormService.getEmprestimos(this.editForm);
    if (emprestimos.id !== null) {
      this.subscribeToSaveResponse(this.emprestimosService.update(emprestimos));
    } else {
      this.subscribeToSaveResponse(this.emprestimosService.create(emprestimos));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmprestimos>>): void {
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

  protected updateForm(emprestimos: IEmprestimos): void {
    this.emprestimos = emprestimos;
    this.emprestimosFormService.resetForm(this.editForm, emprestimos);

    this.livrosSharedCollection = this.livroService.addLivroToCollectionIfMissing<ILivro>(this.livrosSharedCollection, emprestimos.livro);
    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing<ICliente>(
      this.clientesSharedCollection,
      emprestimos.cliente,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.livroService
      .query()
      .pipe(map((res: HttpResponse<ILivro[]>) => res.body ?? []))
      .pipe(map((livros: ILivro[]) => this.livroService.addLivroToCollectionIfMissing<ILivro>(livros, this.emprestimos?.livro)))
      .subscribe((livros: ILivro[]) => (this.livrosSharedCollection = livros));

    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(
        map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing<ICliente>(clientes, this.emprestimos?.cliente)),
      )
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));
  }
}
