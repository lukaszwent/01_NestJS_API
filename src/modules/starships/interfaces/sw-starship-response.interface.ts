import { Starship } from '../entity/starship.entity';

export interface SWStarshipsResponse {
  count: number;
  next: boolean;
  previous: boolean;
  results: Starship[];
}
