import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalFilm } from '../interfaces/external-film.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class FilmRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfFilmsInCache(
    films: ExternalListResponse<ExternalFilm>,
    page?: number,
    limit?: number,
  ): Promise<void> {
    if (page || limit) {
      await this.cacheManager.set(
        `films:${page}:${limit}`,
        JSON.stringify(films),
      );
    } else {
      await this.cacheManager.set(`films`, JSON.stringify(films));
    }
  }

  async saveFilmInCache(film: ExternalItemResponse<ExternalFilm>) {
    await this.cacheManager.set(
      `film:${film.result.uid}`,
      JSON.stringify(film),
    );
  }

  async saveUniqueWordPairsInCache(uniqueWordPairs: (string | number)[][]) {
    await this.cacheManager.set(
      `uniqueWordPairs`,
      JSON.stringify(uniqueWordPairs),
    );
  }

  async saveCharacterWithMostMentionsInCache(character: string[]) {
    await this.cacheManager.set(
      `characterWithMostMentions`,
      JSON.stringify(character),
    );
  }

  async findOne(id: string): Promise<ExternalItemResponse<ExternalFilm>> {
    const film = await this.cacheManager.get(`film:${id}`);

    return film ? JSON.parse(film as string) : null;
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<ExternalListResponse<ExternalFilm>> {
    let films;
    if (page || limit) {
      films = await this.cacheManager.get(`films:${page}:${limit}`);
    } else {
      films = await this.cacheManager.get(`films`);
    }

    return films ? JSON.parse(films as string) : null;
  }

  async findUniqueWordPairs(): Promise<(string | number)[][]> {
    const uniqueWordPairs = await this.cacheManager.get(`uniqueWordPairs`);

    return uniqueWordPairs ? JSON.parse(uniqueWordPairs as string) : null;
  }

  async findCharacterWithMostMentions(): Promise<string[]> {
    const character = await this.cacheManager.get(`characterWithMostMentions`);

    return character ? JSON.parse(character as string) : null;
  }
}
