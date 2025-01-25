import dayjs from 'dayjs/esm';
import { ILivro } from 'app/entities/livro/livro.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IEmprestimos {
  id: number;
  dataEmprestimo?: dayjs.Dayjs | null;
  dataDevolucao?: dayjs.Dayjs | null;
  status?: keyof typeof Status | null;
  livro?: ILivro | null;
  cliente?: ICliente | null;
}

export type NewEmprestimos = Omit<IEmprestimos, 'id'> & { id: null };
