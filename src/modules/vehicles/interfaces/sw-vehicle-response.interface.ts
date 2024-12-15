import { Vehicle } from '../entity/vehicle.entity';

export interface SWVehiclesResponse {
  count: number;
  next: boolean;
  previous: boolean;
  results: Vehicle[];
}
