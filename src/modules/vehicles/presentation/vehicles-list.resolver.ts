import { Args, Resolver, Query } from '@nestjs/graphql';
import { VehicleService } from '../application/vehicle.service';
import { VehiclesListDto } from '../dto/vehicles-list.dto';

@Resolver(() => VehiclesListDto)
export class VehiclesListResolver {
  constructor(private readonly vehiclesService: VehicleService) {}

  @Query(() => VehiclesListDto)
  async getVehiclesList(
    @Args('page') page: string,
    @Args('query') searchQuery: string,
  ) {
    return await this.vehiclesService.findAll(+page, searchQuery);
  }
}
