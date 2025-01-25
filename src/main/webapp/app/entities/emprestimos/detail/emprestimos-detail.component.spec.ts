import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EmprestimosDetailComponent } from './emprestimos-detail.component';

describe('Emprestimos Management Detail Component', () => {
  let comp: EmprestimosDetailComponent;
  let fixture: ComponentFixture<EmprestimosDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmprestimosDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./emprestimos-detail.component').then(m => m.EmprestimosDetailComponent),
              resolve: { emprestimos: () => of({ id: 3739 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EmprestimosDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmprestimosDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load emprestimos on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EmprestimosDetailComponent);

      // THEN
      expect(instance.emprestimos()).toEqual(expect.objectContaining({ id: 3739 }));
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
