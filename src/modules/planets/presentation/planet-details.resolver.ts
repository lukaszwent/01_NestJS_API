import { Args, Resolver, Query } from '@nestjs/graphql';
import { PlanetService } from '../application/planet.service';
import { PlanetDetailsDto } from '../dto/planet-details.dto';

@Resolver(() => PlanetDetailsDto)
export class PlanetDetailsResolver {
  constructor(private readonly planetsService: PlanetService) {}

  @Query(() => PlanetDetailsDto)
  async getPlanet(@Args('id') id: string) {
    return await this.planetsService.findOne(id);
  }
}
