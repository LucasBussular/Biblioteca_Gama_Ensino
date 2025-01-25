import { IGenero, NewGenero } from './genero.model';

export const sampleWithRequiredData: IGenero = {
  id: 32014,
  genero: 'lest agitated spirit',
};

export const sampleWithPartialData: IGenero = {
  id: 9604,
  genero: 'flawless',
};

export const sampleWithFullData: IGenero = {
  id: 21617,
  genero: 'jubilantly',
};

export const sampleWithNewData: NewGenero = {
  genero: 'beneath',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
