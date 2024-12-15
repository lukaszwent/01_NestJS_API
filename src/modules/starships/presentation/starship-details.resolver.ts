import { Args, Resolver, Query } from '@nestjs/graphql';
import { StarshipService } from '../application/starship.service';
import { StarshipDetailsDto } from '../dto/starship-details.dto';

@Resolver(() => StarshipDetailsDto)
export class StarshipDetailsResolver {
  constructor(private readonly starshipsService: StarshipService) {}

  @Query(() => StarshipDetailsDto)
  async getStarship(@Args('id') id: string) {
    return await this.starshipsService.findOne(id);
  }
}
