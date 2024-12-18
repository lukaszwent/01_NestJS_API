import { Module } from '@nestjs/common';
import { FilmService } from './application/film.service';
import { FilmRepository } from './infrastructure/film.repository';
import { FilmDetailsResolver } from './presentation/film-details.resolver';
import { FilmsListResolver } from './presentation/films-list.resolver';
import { FilmMapper } from './film.mapper';
import { PeopleModule } from '../people/people.module';

@Module({
  imports: [PeopleModule],
  controllers: [],
  providers: [
    FilmService,
    FilmRepository,
    FilmDetailsResolver,
    FilmsListResolver,
    FilmMapper,
  ],
})
export class FilmsModule {}
