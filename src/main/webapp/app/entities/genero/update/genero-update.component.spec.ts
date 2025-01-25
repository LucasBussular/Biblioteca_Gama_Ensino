import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { GeneroService } from '../service/genero.service';
import { IGenero } from '../genero.model';
import { GeneroFormService } from './genero-form.service';

import { GeneroUpdateComponent } from './genero-update.component';

describe('Genero Management Update Component', () => {
  let comp: GeneroUpdateComponent;
  let fixture: ComponentFixture<GeneroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let generoFormService: GeneroFormService;
  let generoService: GeneroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GeneroUpdateComponent],
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
      .overrideTemplate(GeneroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GeneroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    generoFormService = TestBed.inject(GeneroFormService);
    generoService = TestBed.inject(GeneroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const genero: IGenero = { id: 13171 };

      activatedRoute.data = of({ genero });
      comp.ngOnInit();

      expect(comp.genero).toEqual(genero);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGenero>>();
      const genero = { id: 6830 };
      jest.spyOn(generoFormService, 'getGenero').mockReturnValue(genero);
      jest.spyOn(generoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genero });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: genero }));
      saveSubject.complete();

      // THEN
      expect(generoFormService.getGenero).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(generoService.update).toHaveBeenCalledWith(expect.objectContaining(genero));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGenero>>();
      const genero = { id: 6830 };
      jest.spyOn(generoFormService, 'getGenero').mockReturnValue({ id: null });
      jest.spyOn(generoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genero: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: genero }));
      saveSubject.complete();

      // THEN
      expect(generoFormService.getGenero).toHaveBeenCalled();
      expect(generoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGenero>>();
      const genero = { id: 6830 };
      jest.spyOn(generoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ genero });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(generoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
