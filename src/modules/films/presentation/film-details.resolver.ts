import { Args, Resolver, Query } from '@nestjs/graphql';
import { FilmService } from '../application/film.service';
import { FilmDetailsDto } from '../dto/film-details.dto';

@Resolver(() => FilmDetailsDto)
export class FilmDetailsResolver {
  constructor(private readonly filmsService: FilmService) {}

  @Query(() => FilmDetailsDto)
  async getFilm(@Args('id') id: string) {
    return await this.filmsService.findOne(id);
  }
}
