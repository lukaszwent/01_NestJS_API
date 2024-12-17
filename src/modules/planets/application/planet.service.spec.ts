import { Test, TestingModule } from '@nestjs/testing';
import { PlanetService } from './planet.service';
import { PlanetRepository } from '../infrastructure/planet.repository';
import { PlanetMapper } from './../planet.mapper';
import { HttpClientService } from '../../../common/services/http-client.service';
import { PlanetDetailsDto } from '../dto/planet-details.dto';
import { PlanetsListDto } from '../dto/planets-list.dto';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { ExternalPlanet } from '../interfaces/external-planet.interface';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';

describe('PlanetService', () => {
  let service: PlanetService;
  let planetRepository: PlanetRepository;
  let planetMapper: PlanetMapper;
  let httpClient: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetService,
        {
          provide: PlanetRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            savePlanetInCache: jest.fn(),
            saveListOfPlanetsInCache: jest.fn(),
          },
        },
        {
          provide: PlanetMapper,
          useValue: {
            mapDetailsToDTO: jest.fn(),
            mapListToDTO: jest.fn(),
          },
        },
        {
          provide: HttpClientService,
          useValue: {
            getOne: jest.fn(),
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlanetService>(PlanetService);
    planetRepository = module.get<PlanetRepository>(PlanetRepository);
    planetMapper = module.get<PlanetMapper>(PlanetMapper);
    httpClient = module.get<HttpClientService>(HttpClientService);
  });

  describe('findOne', () => {
    it('should return cached planet details if found in cache', async () => {
      const id = '1';
      const cachedPlanet: ExternalItemResponse<ExternalPlanet> = {
        message: 'OK',
        result: {
          properties: {
            name: 'Earth',
            rotation_period: '24',
            orbital_period: '365',
            diameter: '12742',
            climate: 'temperate',
            gravity: '1 standard',
            terrain: 'varied',
            surface_water: '70',
            population: '7.8 billion',
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/planets/1/',
          },
          description: '',
          _id: '',
          uid: '1',
          __v: 0,
        },
      };
      const planetDetailsDto = new PlanetDetailsDto();

      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(cachedPlanet);
      jest
        .spyOn(planetMapper, 'mapDetailsToDTO')
        .mockReturnValue(planetDetailsDto);

      const result = await service.findOne(id);

      expect(planetRepository.findOne).toHaveBeenCalledWith(id);
      expect(planetMapper.mapDetailsToDTO).toHaveBeenCalledWith(cachedPlanet);
      expect(result).toBe(planetDetailsDto);
    });

    it('should fetch planet details from external API if not found in cache', async () => {
      const id = '1';
      const externalPlanet = { id, name: 'Mars' };
      const planetDetailsDto = new PlanetDetailsDto();

      jest.spyOn(planetRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(httpClient, 'getOne')
        .mockResolvedValue({ data: externalPlanet });
      jest.spyOn(planetRepository, 'savePlanetInCache').mockImplementation();
      jest
        .spyOn(planetMapper, 'mapDetailsToDTO')
        .mockReturnValue(planetDetailsDto);

      const result = await service.findOne(id);

      expect(planetRepository.findOne).toHaveBeenCalledWith(id);
      expect(httpClient.getOne).toHaveBeenCalledWith(`planets/${id}`);
      expect(planetRepository.savePlanetInCache).toHaveBeenCalledWith({
        data: externalPlanet,
      });
      expect(planetMapper.mapDetailsToDTO).toHaveBeenCalledWith({
        data: externalPlanet,
      });
      expect(result).toBe(planetDetailsDto);
    });
  });

  describe('findAll', () => {
    it('should return cached planets list if found in cache', async () => {
      const page = 1;
      const limit = 10;
      const cachedPlanets: ExternalListResponse<ExternalPlanet> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Earth',
            rotation_period: '24',
            orbital_period: '365',
            diameter: '12742',
            climate: 'temperate',
            gravity: '1 standard',
            terrain: 'varied',
            surface_water: '70',
            population: '7.8 billion',
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/planets/1/',
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const planetsListDto = new PlanetsListDto();

      jest.spyOn(planetRepository, 'findAll').mockResolvedValue(cachedPlanets);
      jest.spyOn(planetMapper, 'mapListToDTO').mockReturnValue(planetsListDto);

      const result = await service.findAll(page, limit);

      expect(planetRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(planetMapper.mapListToDTO).toHaveBeenCalledWith(cachedPlanets, {
        limit,
        page,
      });
      expect(result).toBe(planetsListDto);
    });

    it('should fetch planets list from external API if not found in cache', async () => {
      const page = 1;
      const limit = 10;
      const externalPlanets: ExternalListResponse<ExternalPlanet> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Earth',
            rotation_period: '24',
            orbital_period: '365',
            diameter: '12742',
            climate: 'temperate',
            gravity: '1 standard',
            terrain: 'varied',
            surface_water: '70',
            population: '7.8 billion',
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/planets/1/',
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const planetsListDto = new PlanetsListDto();

      jest.spyOn(planetRepository, 'findAll').mockResolvedValue(null);
      jest.spyOn(httpClient, 'getAll').mockResolvedValue(externalPlanets);
      jest
        .spyOn(planetRepository, 'saveListOfPlanetsInCache')
        .mockImplementation();
      jest.spyOn(planetMapper, 'mapListToDTO').mockReturnValue(planetsListDto);

      const result = await service.findAll(page, limit);

      expect(planetRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(httpClient.getAll).toHaveBeenCalledWith('planets', {
        page,
        limit,
      });
      expect(planetRepository.saveListOfPlanetsInCache).toHaveBeenCalledWith(
        externalPlanets,
        page,
        limit,
      );
      expect(planetMapper.mapListToDTO).toHaveBeenCalledWith(externalPlanets, {
        limit,
        page,
      });
      expect(result).toBe(planetsListDto);
    });
  });
});
