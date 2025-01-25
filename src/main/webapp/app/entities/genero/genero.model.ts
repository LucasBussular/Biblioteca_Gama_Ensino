export interface IGenero {
  id: number;
  genero?: string | null;
}

export type NewGenero = Omit<IGenero, 'id'> & { id: null };
