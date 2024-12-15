import { Args, Resolver, Query } from '@nestjs/graphql';
import { SpeciesService } from '../application/species.service';
import { SpeciesListDto } from '../dto/species-list.dto';

@Resolver(() => SpeciesListDto)
export class SpeciesListResolver {
  constructor(private readonly speciesService: SpeciesService) {}

  @Query(() => SpeciesListDto)
  async getSpeciesList(
    @Args('page') page: string,
    @Args('query') searchQuery: string,
  ) {
    return await this.speciesService.findAll(+page, searchQuery);
  }
}
