import { ExternalFilm } from './external-film.interface';

export interface CustomFilmsResponse {
  message: string;
  total_records: number;
  total_pages: number;
  previous: string;
  next: string;
  result: CustomFilmsResult[];
}

export interface CustomFilmsResult {
  properties: ExternalFilm;
  description: string;
  _id: string;
  uid: string;
  __v: number;
}
