import { Args, Resolver, Query } from '@nestjs/graphql';
import { StarshipService } from '../application/starship.service';
import { StarshipsListDto } from '../dto/starships-list.dto';

@Resolver(() => StarshipsListDto)
export class StarshipsListResolver {
  constructor(private readonly starshipsService: StarshipService) {}

  @Query(() => StarshipsListDto)
  async getStarshipsList(
    @Args('page', { defaultValue: 1 }) page: number = 1,
    @Args('limit', { defaultValue: 10 }) limit: number = 10,
  ) {
    return await this.starshipsService.findAll(page, limit);
  }
}
