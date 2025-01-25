import { IGenero } from 'app/entities/genero/genero.model';

export interface ILivro {
  id: number;
  titulo?: string | null;
  autor?: string | null;
  anoPublicacao?: number | null;
  isbn?: string | null;
  genero?: IGenero | null;
}

export type NewLivro = Omit<ILivro, 'id'> & { id: null };
