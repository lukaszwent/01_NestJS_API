import { Args, Resolver, Query } from '@nestjs/graphql';
import { VehicleService } from '../application/vehicle.service';
import { VehicleDetailsDto } from '../dto/vehicle-details.dto';

@Resolver(() => VehicleDetailsDto)
export class VehicleDetailsResolver {
  constructor(private readonly vehiclesService: VehicleService) {}

  @Query(() => VehicleDetailsDto)
  async getVehicle(@Args('id') id: string) {
    return await this.vehiclesService.findOne(id);
  }
}
