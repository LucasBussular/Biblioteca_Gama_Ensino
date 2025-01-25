import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IGenero } from '../genero.model';

@Component({
  selector: 'jhi-genero-detail',
  templateUrl: './genero-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class GeneroDetailComponent {
  genero = input<IGenero | null>(null);

  previousState(): void {
    window.history.back();
  }
}
