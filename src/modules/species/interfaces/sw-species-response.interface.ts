import { Species } from '../entity/species.entity';

export interface SWSpeciesResponse {
  count: number;
  next: boolean;
  previous: boolean;
  results: Species[];
}
