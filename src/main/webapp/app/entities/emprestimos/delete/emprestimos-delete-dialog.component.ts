import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEmprestimos } from '../emprestimos.model';
import { EmprestimosService } from '../service/emprestimos.service';

@Component({
  templateUrl: './emprestimos-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EmprestimosDeleteDialogComponent {
  emprestimos?: IEmprestimos;

  protected emprestimosService = inject(EmprestimosService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emprestimosService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
