import { Args, Resolver, Query } from '@nestjs/graphql';
import { SpeciesService } from '../application/species.service';
import { SpeciesListDto } from '../dto/species-list.dto';

@Resolver(() => SpeciesListDto)
export class SpeciesListResolver {
  constructor(private readonly speciesService: SpeciesService) {}

  @Query(() => SpeciesListDto)
  async getSpeciesList(
    @Args('page', { defaultValue: 1 }) page: number = 1,
    @Args('limit', { defaultValue: 10 }) limit: number = 10,
  ) {
    return await this.speciesService.findAll(+page, limit);
  }
}
