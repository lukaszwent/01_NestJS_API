import { Module } from '@nestjs/common';
import { FilmService } from './application/film.service';
import { HttpModule } from '@nestjs/axios';
import { FilmRepository } from './infrastructure/film.repository';
import { RedisModule } from '@nestjs-modules/ioredis';
import { FilmDetailsResolver } from './presentation/film-details.resolver';
import { FilmsListResolver } from './presentation/films-list.resolver';

@Module({
  imports: [HttpModule, RedisModule],
  controllers: [],
  providers: [
    FilmService,
    FilmRepository,
    FilmDetailsResolver,
    FilmsListResolver,
    FilmDetailsResolver,
  ],
})
export class FilmsModule {}
