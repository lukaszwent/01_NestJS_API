import { Args, Resolver, Query } from '@nestjs/graphql';
import { VehicleService } from '../application/vehicle.service';
import { VehiclesListDto } from '../dto/vehicles-list.dto';

@Resolver(() => VehiclesListDto)
export class VehiclesListResolver {
  constructor(private readonly vehiclesService: VehicleService) {}

  @Query(() => VehiclesListDto)
  async getVehiclesList(
    @Args('page', { defaultValue: 1 }) page: number = 1,
    @Args('limit', { defaultValue: 10, nullable: true }) limit: number = 10,
  ) {
    return await this.vehiclesService.findAll(+page, limit);
  }
}
