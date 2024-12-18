import { PlanetMapper } from './../planet.mapper';
import { PlanetRepository } from '../infrastructure/planet.repository';
import { Injectable } from '@nestjs/common';
import { PlanetsListDto } from '../dto/planets-list.dto';
import { PlanetDetailsDto } from '../dto/planet-details.dto';
import { ExternalPlanet } from '../interfaces/external-planet.interface';
import { HttpClientService } from '../../../common/services/http-client.service';

@Injectable()
export class PlanetService {
  constructor(
    private planetRepository: PlanetRepository,
    private planetMapper: PlanetMapper,
    private httpClient: HttpClientService,
  ) {}

  async findOne(id: string): Promise<PlanetDetailsDto> {
    const cachedPlanet = await this.planetRepository.findOne(id);

    if (cachedPlanet) {
      return this.planetMapper.mapDetailsToDTO(cachedPlanet);
    }

    const planet = await this.httpClient.getOne<ExternalPlanet>(
      `planets/${id}`,
    );

    this.planetRepository.savePlanetInCache(planet);

    return this.planetMapper.mapDetailsToDTO(planet);
  }

  async findAll(page: number, limit: number): Promise<PlanetsListDto> {
    const cachedPlanets = await this.planetRepository.findAll(page, limit);

    if (cachedPlanets) {
      return this.planetMapper.mapListToDTO(cachedPlanets, { limit, page });
    }

    const params = {
      page: page,
      limit: limit,
    };

    if (!page) {
      delete params.page;
    }
    if (!limit) {
      delete params.limit;
    }

    const planets = await this.httpClient.getAll<ExternalPlanet>(
      'planets',
      params,
    );

    const planetsListDto = this.planetMapper.mapListToDTO(planets, {
      limit,
      page,
    });

    this.planetRepository.saveListOfPlanetsInCache(planets, page, limit);

    return planetsListDto;
  }
}
