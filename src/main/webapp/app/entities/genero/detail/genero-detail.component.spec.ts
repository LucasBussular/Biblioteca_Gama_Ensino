import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GeneroDetailComponent } from './genero-detail.component';

describe('Genero Management Detail Component', () => {
  let comp: GeneroDetailComponent;
  let fixture: ComponentFixture<GeneroDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneroDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./genero-detail.component').then(m => m.GeneroDetailComponent),
              resolve: { genero: () => of({ id: 6830 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GeneroDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneroDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load genero on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GeneroDetailComponent);

      // THEN
      expect(instance.genero()).toEqual(expect.objectContaining({ id: 6830 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
