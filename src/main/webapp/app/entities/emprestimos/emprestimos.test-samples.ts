import dayjs from 'dayjs/esm';

import { IEmprestimos, NewEmprestimos } from './emprestimos.model';

export const sampleWithRequiredData: IEmprestimos = {
  id: 3469,
  dataEmprestimo: dayjs('2025-01-25T00:23'),
  status: 'ATRASADO',
};

export const sampleWithPartialData: IEmprestimos = {
  id: 2489,
  dataEmprestimo: dayjs('2025-01-25T08:40'),
  dataDevolucao: dayjs('2025-01-25T10:51'),
  status: 'DEVOLVIDO',
};

export const sampleWithFullData: IEmprestimos = {
  id: 15570,
  dataEmprestimo: dayjs('2025-01-24T23:00'),
  dataDevolucao: dayjs('2025-01-25T01:37'),
  status: 'EMPRESTADO',
};

export const sampleWithNewData: NewEmprestimos = {
  dataEmprestimo: dayjs('2025-01-25T00:50'),
  status: 'EMPRESTADO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
