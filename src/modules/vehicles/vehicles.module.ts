import { Module } from '@nestjs/common';
import { VehicleService } from './application/vehicle.service';
import { HttpModule } from '@nestjs/axios';
import { VehicleRepository } from './infrastructure/vehicle.repository';
import { RedisModule } from '@nestjs-modules/ioredis';
import { VehicleDetailsResolver } from './presentation/vehicle-details.resolver';
import { VehiclesListResolver } from './presentation/vehicles-list.resolver';

@Module({
  imports: [HttpModule, RedisModule],
  controllers: [],
  providers: [
    VehicleService,
    VehicleRepository,
    VehicleDetailsResolver,
    VehiclesListResolver,
  ],
})
export class VehiclesModule {}
