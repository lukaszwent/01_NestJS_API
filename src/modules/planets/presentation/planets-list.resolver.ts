import { Args, Resolver, Query } from '@nestjs/graphql';
import { PlanetService } from '../application/planet.service';
import { PlanetsListDto } from '../dto/planets-list.dto';

@Resolver(() => PlanetsListDto)
export class PlanetsListResolver {
  constructor(private readonly planetsService: PlanetService) {}

  @Query(() => PlanetsListDto)
  async getPlanetsList(
    @Args('page', { defaultValue: 1 }) page: number = 1,
    @Args('limit', { defaultValue: 10, nullable: true }) limit: number = 10,
  ) {
    return await this.planetsService.findAll(+page, limit);
  }
}
