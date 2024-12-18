import { TestingModule, Test } from '@nestjs/testing';
import { PlanetRepository } from './planet.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalPlanet } from '../interfaces/external-planet.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { PlanetDetailsDto } from '../dto/planet-details.dto';

describe('PlanetRepository', () => {
  let repository: PlanetRepository;
  let detailsResponse: ExternalItemResponse<ExternalPlanet>;
  let listResponse: ExternalListResponse<ExternalPlanet>;
  let planet: PlanetDetailsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [PlanetRepository],
    }).compile();

    repository = module.get<PlanetRepository>(PlanetRepository);
    planet = new PlanetDetailsDto();
    planet.id = '1';
    planet.name = 'Earth';
    planet.diameter = '12742';
    planet.climate = 'temperate';
    planet.gravity = '1 standard';
    planet.terrain = 'varied';
    planet.population = '7.8 billion';

    detailsResponse = {
      message: '',
      result: {
        properties: planet,
        description: '',
        _id: '',
        uid: '1',
        __v: 0,
      },
    };

    listResponse = {
      message: 'Success',
      results: [planet],
      total_records: 2,
      total_pages: 1,
      previous: null,
      next: null,
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of planets', async () => {
    await repository.saveListOfPlanetsInCache(listResponse, 1);
    const planets = await repository.findAll(1);
    expect(planets.results).toBeInstanceOf(Array);
  });

  it('should return a single planet', async () => {
    await repository.savePlanetInCache(detailsResponse);
    const planet = await repository.findOne('1');
    expect(planet).toBeInstanceOf(Object);
    expect(planet.result.uid).toBe('1');
  });
});
