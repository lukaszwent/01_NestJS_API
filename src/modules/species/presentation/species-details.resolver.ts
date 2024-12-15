import { Args, Resolver, Query } from '@nestjs/graphql';
import { SpeciesDetailsDto } from '../dto/species-details.dto';
import { SpeciesService } from '../application/species.service';

@Resolver(() => SpeciesDetailsDto)
export class SpeciesDetailsResolver {
  constructor(private readonly speciesService: SpeciesService) {}

  @Query(() => SpeciesDetailsDto)
  async getSpecies(@Args('id') id: string) {
    return await this.speciesService.findOne(id);
  }
}
