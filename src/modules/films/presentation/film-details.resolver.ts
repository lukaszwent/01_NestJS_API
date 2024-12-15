import { Args, Resolver, Query } from '@nestjs/graphql';
import { FilmDetailsDto } from '../dto/film-details.dto';
import { FilmService } from '../application/film.service';

@Resolver(() => FilmDetailsDto)
export class FilmDetailsResolver {
  constructor(private readonly filmsService: FilmService) {}

  @Query(() => FilmDetailsDto)
  async getFilm(@Args('id') id: string) {
    return await this.filmsService.findOne(id);
  }
}
