import { ICliente, NewCliente } from './cliente.model';

export const sampleWithRequiredData: ICliente = {
  id: 2897,
  nome: 'wherever alongside per',
  email: 'Helena_Xavier22@live.com',
};

export const sampleWithPartialData: ICliente = {
  id: 6094,
  nome: 'besides',
  email: 'Benjamin_Souza@gmail.com',
};

export const sampleWithFullData: ICliente = {
  id: 17129,
  nome: 'circumference',
  email: 'Livia_Carvalho@hotmail.com',
  telefone: 'council',
};

export const sampleWithNewData: NewCliente = {
  nome: 'under',
  email: 'Silas.Martins@gmail.com',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
