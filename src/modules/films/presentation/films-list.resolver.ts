import { Args, Resolver, Query } from '@nestjs/graphql';
import { FilmService } from '../application/film.service';
import { FilmsListDto } from '../dto/films-list.dto';

@Resolver(() => FilmsListDto)
export class FilmsListResolver {
  constructor(private readonly filmsService: FilmService) {}

  @Query(() => FilmsListDto)
  async getFilmsList(
    @Args('page', { defaultValue: 1 }) page: number = 1,
    @Args('limit', { defaultValue: 10 }) limit: number = 10,
  ) {
    return await this.filmsService.findAll(+page, limit);
  }

  @Query(() => [[String, Number]])
  async getUniqueWordPairs() {
    return this.filmsService.getUniqueWordPairs();
  }

  @Query(() => [String])
  async getCharacterWithMostMentions() {
    return this.filmsService.getCharacterWithMostMentions();
  }
}
