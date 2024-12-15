import { Film } from '../entity/film.entity';

export interface SWFilmsResponse {
  count: number;
  next: boolean;
  previous: boolean;
  results: Film[];
}
