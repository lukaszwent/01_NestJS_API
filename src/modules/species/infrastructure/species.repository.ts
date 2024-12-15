import { Inject, Injectable } from '@nestjs/common';
import { Species } from '../entity/species.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { SpeciesListDto } from '../dto/species-list.dto';

@Injectable()
export class SpeciesRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfSpeciesInCache(
    speciesListDto: SpeciesListDto,
    query?: string,
  ): Promise<void> {
    if (speciesListDto.page || query) {
      await this.cacheManager.set(
        `species:${speciesListDto.page}:${query}`,
        JSON.stringify(speciesListDto),
      );
    } else {
      await this.cacheManager.set(`species`, JSON.stringify(speciesListDto));
    }
  }

  async saveSpeciesInCache(species: Species) {
    await this.cacheManager.set(
      `species:${species.id}`,
      JSON.stringify(species),
    );
  }

  async findOne(id: string): Promise<Species> {
    const species = await this.cacheManager.get(`species:${id}`);

    return species ? JSON.parse(species as string) : null;
  }

  async findAll(page: number, query: string): Promise<SpeciesListDto> {
    let species;
    if (page || query) {
      species = await this.cacheManager.get(`species:${page}:${query}`);
    } else {
      species = await this.cacheManager.get(`species`);
    }

    return species ? JSON.parse(species as string) : null;
  }
}
