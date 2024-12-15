import { Args, Resolver, Query } from '@nestjs/graphql';
import { FilmService } from '../application/film.service';
import { FilmsListDto } from '../dto/films-list.dto';

@Resolver(() => FilmsListDto)
export class FilmsListResolver {
  constructor(private readonly filmsService: FilmService) {}

  @Query(() => FilmsListDto)
  async getFilmsList(
    @Args('page') page: string,
    @Args('query') searchQuery: string,
  ) {
    return await this.filmsService.findAll(+page, searchQuery);
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
