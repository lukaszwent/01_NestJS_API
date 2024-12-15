import { Inject, Injectable } from '@nestjs/common';
import { Film } from '../entity/film.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { FilmsListDto } from '../dto/films-list.dto';

@Injectable()
export class FilmRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfFilmsInCache(
    filmsListDto: FilmsListDto,
    query?: string,
  ): Promise<void> {
    if (filmsListDto.page || query) {
      await this.cacheManager.set(
        `films:${filmsListDto.page}:${query}`,
        JSON.stringify(filmsListDto),
      );
    } else {
      await this.cacheManager.set(`films`, JSON.stringify(filmsListDto));
    }
  }

  async saveFilmInCache(film: Film) {
    await this.cacheManager.set(`film:${film.id}`, JSON.stringify(film));
  }

  async findOne(id: string): Promise<Film> {
    const film = await this.cacheManager.get(`film:${id}`);

    return film ? JSON.parse(film as string) : null;
  }

  async findAll(page?: number, query?: string): Promise<FilmsListDto> {
    let films;

    if (page || query) {
      films = await this.cacheManager.get(`films:${page}:${query}`);
    } else {
      films = await this.cacheManager.get(`films`);
    }

    return films ? JSON.parse(films as string) : null;
  }
}
