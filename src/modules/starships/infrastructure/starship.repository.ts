import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { StarshipsListDto } from '../dto/starships-list.dto';
import { Starship } from '../entity/starship.entity';

@Injectable()
export class StarshipRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfStarshipsInCache(
    starshipsListDto: StarshipsListDto,
    query?: string,
  ): Promise<void> {
    if (starshipsListDto.page || query) {
      await this.cacheManager.set(
        `starships:${starshipsListDto.page}:${query}`,
        JSON.stringify(starshipsListDto),
      );
    } else {
      await this.cacheManager.set(
        `starships`,
        JSON.stringify(starshipsListDto),
      );
    }
  }

  async saveStarshipInCache(starship: Starship) {
    await this.cacheManager.set(
      `starship:${starship.id}`,
      JSON.stringify(starship),
    );
  }

  async findOne(id: string): Promise<Starship> {
    const starship = await this.cacheManager.get(`starship:${id}`);

    return starship ? JSON.parse(starship as string) : null;
  }

  async findAll(page: number, query: string): Promise<StarshipsListDto> {
    let starships;
    if (page || query) {
      starships = await this.cacheManager.get(`starships:${page}:${query}`);
    } else {
      starships = await this.cacheManager.get(`starships`);
    }

    return starships ? JSON.parse(starships as string) : null;
  }
}
