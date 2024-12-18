import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalPlanet } from '../interfaces/external-planet.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class PlanetRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfPlanetsInCache(
    planets: ExternalListResponse<ExternalPlanet>,
    page?: number,
    limit?: number,
  ): Promise<void> {
    if (page || limit) {
      await this.cacheManager.set(
        `planets:${page}:${limit}`,
        JSON.stringify(planets),
      );
    } else {
      await this.cacheManager.set(`planets`, JSON.stringify(planets));
    }
  }

  async savePlanetInCache(planet: ExternalItemResponse<ExternalPlanet>) {
    await this.cacheManager.set(
      `planet:${planet.result.uid}`,
      JSON.stringify(planet),
    );
  }

  async findOne(id: string): Promise<ExternalItemResponse<ExternalPlanet>> {
    const planet = await this.cacheManager.get(`planet:${id}`);

    return planet ? JSON.parse(planet as string) : null;
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<ExternalListResponse<ExternalPlanet>> {
    let planets;
    if (page || limit) {
      planets = await this.cacheManager.get(`planets:${page}:${limit}`);
    } else {
      planets = await this.cacheManager.get(`planets`);
    }

    return planets ? JSON.parse(planets as string) : null;
  }
}
