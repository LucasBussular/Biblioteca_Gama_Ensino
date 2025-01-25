import { ILivro, NewLivro } from './livro.model';

export const sampleWithRequiredData: ILivro = {
  id: 158,
  titulo: 'calculating even',
  autor: 'gadzooks upright next',
  anoPublicacao: 15762,
  isbn: 'provided',
};

export const sampleWithPartialData: ILivro = {
  id: 14655,
  titulo: 'rarely unfreeze',
  autor: 'zowie thankfully',
  anoPublicacao: 7622,
  isbn: 'but unfortunately mooch',
};

export const sampleWithFullData: ILivro = {
  id: 2308,
  titulo: 'until woot geez',
  autor: 'part violently merrily',
  anoPublicacao: 13277,
  isbn: 'ick positively',
};

export const sampleWithNewData: NewLivro = {
  titulo: 'aha',
  autor: 'wallop',
  anoPublicacao: 25681,
  isbn: 'energetically fraternise kindheartedly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
