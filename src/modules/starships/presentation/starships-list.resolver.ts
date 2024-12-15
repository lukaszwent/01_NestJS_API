import { Args, Resolver, Query } from '@nestjs/graphql';
import { StarshipService } from '../application/starship.service';
import { StarshipsListDto } from '../dto/starships-list.dto';

@Resolver(() => StarshipsListDto)
export class StarshipsListResolver {
  constructor(private readonly starshipsService: StarshipService) {}

  @Query(() => StarshipsListDto)
  async getStarshipsList(
    @Args('page') page: string,
    @Args('query') searchQuery: string,
  ) {
    return await this.starshipsService.findAll(+page, searchQuery);
  }
}
