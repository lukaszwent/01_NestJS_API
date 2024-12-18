import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalSpecies } from '../interfaces/external-species.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class SpeciesRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfSpeciesInCache(
    species: ExternalListResponse<ExternalSpecies>,
    page?: number,
    limit?: number,
  ): Promise<void> {
    if (page || limit) {
      await this.cacheManager.set(
        `species:${page}:${limit}`,
        JSON.stringify(species),
      );
    } else {
      await this.cacheManager.set(`species`, JSON.stringify(species));
    }
  }

  async saveSpeciesInCache(species: ExternalItemResponse<ExternalSpecies>) {
    await this.cacheManager.set(
      `species:${species.result.uid}`,
      JSON.stringify(species),
    );
  }

  async findOne(id: string): Promise<ExternalItemResponse<ExternalSpecies>> {
    const species = await this.cacheManager.get(`species:${id}`);

    return species ? JSON.parse(species as string) : null;
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<ExternalListResponse<ExternalSpecies>> {
    let species;
    if (page || limit) {
      species = await this.cacheManager.get(`species:${page}:${limit}`);
    } else {
      species = await this.cacheManager.get(`species`);
    }

    return species ? JSON.parse(species as string) : null;
  }
}
