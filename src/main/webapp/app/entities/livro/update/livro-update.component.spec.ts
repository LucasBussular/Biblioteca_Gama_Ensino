import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IGenero } from 'app/entities/genero/genero.model';
import { GeneroService } from 'app/entities/genero/service/genero.service';
import { LivroService } from '../service/livro.service';
import { ILivro } from '../livro.model';
import { LivroFormService } from './livro-form.service';

import { LivroUpdateComponent } from './livro-update.component';

describe('Livro Management Update Component', () => {
  let comp: LivroUpdateComponent;
  let fixture: ComponentFixture<LivroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let livroFormService: LivroFormService;
  let livroService: LivroService;
  let generoService: GeneroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LivroUpdateComponent],
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
      .overrideTemplate(LivroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LivroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    livroFormService = TestBed.inject(LivroFormService);
    livroService = TestBed.inject(LivroService);
    generoService = TestBed.inject(GeneroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Genero query and add missing value', () => {
      const livro: ILivro = { id: 26070 };
      const genero: IGenero = { id: 6830 };
      livro.genero = genero;

      const generoCollection: IGenero[] = [{ id: 6830 }];
      jest.spyOn(generoService, 'query').mockReturnValue(of(new HttpResponse({ body: generoCollection })));
      const additionalGeneros = [genero];
      const expectedCollection: IGenero[] = [...additionalGeneros, ...generoCollection];
      jest.spyOn(generoService, 'addGeneroToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(generoService.query).toHaveBeenCalled();
      expect(generoService.addGeneroToCollectionIfMissing).toHaveBeenCalledWith(
        generoCollection,
        ...additionalGeneros.map(expect.objectContaining),
      );
      expect(comp.generosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const livro: ILivro = { id: 26070 };
      const genero: IGenero = { id: 6830 };
      livro.genero = genero;

      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      expect(comp.generosSharedCollection).toContainEqual(genero);
      expect(comp.livro).toEqual(livro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 16172 };
      jest.spyOn(livroFormService, 'getLivro').mockReturnValue(livro);
      jest.spyOn(livroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livro }));
      saveSubject.complete();

      // THEN
      expect(livroFormService.getLivro).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(livroService.update).toHaveBeenCalledWith(expect.objectContaining(livro));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 16172 };
      jest.spyOn(livroFormService, 'getLivro').mockReturnValue({ id: null });
      jest.spyOn(livroService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: livro }));
      saveSubject.complete();

      // THEN
      expect(livroFormService.getLivro).toHaveBeenCalled();
      expect(livroService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILivro>>();
      const livro = { id: 16172 };
      jest.spyOn(livroService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ livro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(livroService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareGenero', () => {
      it('Should forward to generoService', () => {
        const entity = { id: 6830 };
        const entity2 = { id: 13171 };
        jest.spyOn(generoService, 'compareGenero');
        comp.compareGenero(entity, entity2);
        expect(generoService.compareGenero).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
