import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalStarship } from '../interfaces/external-starship.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class StarshipRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfStarshipsInCache(
    starships: ExternalListResponse<ExternalStarship>,
    page?: number,
    limit?: number,
  ): Promise<void> {
    if (page || limit) {
      await this.cacheManager.set(
        `starships:${page}:${limit}`,
        JSON.stringify(starships),
      );
    } else {
      await this.cacheManager.set(`starships`, JSON.stringify(starships));
    }
  }

  async saveStarshipInCache(starship: ExternalItemResponse<ExternalStarship>) {
    await this.cacheManager.set(
      `starship:${starship.result.uid}`,
      JSON.stringify(starship),
    );
  }

  async findOne(id: string): Promise<ExternalItemResponse<ExternalStarship>> {
    const starship = await this.cacheManager.get(`starship:${id}`);

    return starship ? JSON.parse(starship as string) : null;
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<ExternalListResponse<ExternalStarship>> {
    let starships;
    if (page || limit) {
      starships = await this.cacheManager.get(`starships:${page}:${limit}`);
    } else {
      starships = await this.cacheManager.get(`starships`);
    }

    return starships ? JSON.parse(starships as string) : null;
  }
}
