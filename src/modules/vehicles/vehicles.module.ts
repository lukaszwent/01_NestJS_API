import { Module } from '@nestjs/common';
import { VehicleService } from './application/vehicle.service';
import { VehicleRepository } from './infrastructure/vehicle.repository';
import { VehicleDetailsResolver } from './presentation/vehicle-details.resolver';
import { VehiclesListResolver } from './presentation/vehicles-list.resolver';
import { VehicleMapper } from './vehicle.mapper';

@Module({
  imports: [],
  controllers: [],
  providers: [
    VehicleService,
    VehicleRepository,
    VehicleDetailsResolver,
    VehiclesListResolver,
    VehicleMapper,
  ],
})
export class VehiclesModule {}
