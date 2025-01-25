import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IEmprestimos } from '../emprestimos.model';

@Component({
  selector: 'jhi-emprestimos-detail',
  templateUrl: './emprestimos-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class EmprestimosDetailComponent {
  emprestimos = input<IEmprestimos | null>(null);

  previousState(): void {
    window.history.back();
  }
}
