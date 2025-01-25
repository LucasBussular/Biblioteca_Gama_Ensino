import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ILivro } from 'app/entities/livro/livro.model';
import { LivroService } from 'app/entities/livro/service/livro.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IEmprestimos } from '../emprestimos.model';
import { EmprestimosService } from '../service/emprestimos.service';
import { EmprestimosFormService } from './emprestimos-form.service';

import { EmprestimosUpdateComponent } from './emprestimos-update.component';

describe('Emprestimos Management Update Component', () => {
  let comp: EmprestimosUpdateComponent;
  let fixture: ComponentFixture<EmprestimosUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emprestimosFormService: EmprestimosFormService;
  let emprestimosService: EmprestimosService;
  let livroService: LivroService;
  let clienteService: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmprestimosUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EmprestimosUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmprestimosUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emprestimosFormService = TestBed.inject(EmprestimosFormService);
    emprestimosService = TestBed.inject(EmprestimosService);
    livroService = TestBed.inject(LivroService);
    clienteService = TestBed.inject(ClienteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Livro query and add missing value', () => {
      const emprestimos: IEmprestimos = { id: 10176 };
      const livro: ILivro = { id: 16172 };
      emprestimos.livro = livro;

      const livroCollection: ILivro[] = [{ id: 16172 }];
      jest.spyOn(livroService, 'query').mockReturnValue(of(new HttpResponse({ body: livroCollection })));
      const additionalLivros = [livro];
      const expectedCollection: ILivro[] = [...additionalLivros, ...livroCollection];
      jest.spyOn(livroService, 'addLivroToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emprestimos });
      comp.ngOnInit();

      expect(livroService.query).toHaveBeenCalled();
      expect(livroService.addLivroToCollectionIfMissing).toHaveBeenCalledWith(
        livroCollection,
        ...additionalLivros.map(expect.objectContaining),
      );
      expect(comp.livrosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Cliente query and add missing value', () => {
      const emprestimos: IEmprestimos = { id: 10176 };
      const cliente: ICliente = { id: 13484 };
      emprestimos.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 13484 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emprestimos });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(
        clienteCollection,
        ...additionalClientes.map(expect.objectContaining),
      );
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const emprestimos: IEmprestimos = { id: 10176 };
      const livro: ILivro = { id: 16172 };
      emprestimos.livro = livro;
      const cliente: ICliente = { id: 13484 };
      emprestimos.cliente = cliente;

      activatedRoute.data = of({ emprestimos });
      comp.ngOnInit();

      expect(comp.livrosSharedCollection).toContainEqual(livro);
      expect(comp.clientesSharedCollection).toContainEqual(cliente);
      expect(comp.emprestimos).toEqual(emprestimos);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmprestimos>>();
      const emprestimos = { id: 3739 };
      jest.spyOn(emprestimosFormService, 'getEmprestimos').mockReturnValue(emprestimos);
      jest.spyOn(emprestimosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emprestimos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emprestimos }));
      saveSubject.complete();

      // THEN
      expect(emprestimosFormService.getEmprestimos).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(emprestimosService.update).toHaveBeenCalledWith(expect.objectContaining(emprestimos));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmprestimos>>();
      const emprestimos = { id: 3739 };
      jest.spyOn(emprestimosFormService, 'getEmprestimos').mockReturnValue({ id: null });
      jest.spyOn(emprestimosService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emprestimos: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emprestimos }));
      saveSubject.complete();

      // THEN
      expect(emprestimosFormService.getEmprestimos).toHaveBeenCalled();
      expect(emprestimosService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEmprestimos>>();
      const emprestimos = { id: 3739 };
      jest.spyOn(emprestimosService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emprestimos });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emprestimosService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLivro', () => {
      it('Should forward to livroService', () => {
        const entity = { id: 16172 };
        const entity2 = { id: 26070 };
        jest.spyOn(livroService, 'compareLivro');
        comp.compareLivro(entity, entity2);
        expect(livroService.compareLivro).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCliente', () => {
      it('Should forward to clienteService', () => {
        const entity = { id: 13484 };
        const entity2 = { id: 20795 };
        jest.spyOn(clienteService, 'compareCliente');
        comp.compareCliente(entity, entity2);
        expect(clienteService.compareCliente).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
