import { Test, TestingModule } from '@nestjs/testing';
import { StarshipService } from './starship.service';
import { StarshipRepository } from '../infrastructure/starship.repository';
import { StarshipMapper } from '../starship.mapper';
import { HttpClientService } from '../../../common/services/http-client.service';
import { StarshipDetailsDto } from '../dto/starship-details.dto';
import { StarshipsListDto } from '../dto/starships-list.dto';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { ExternalStarship } from '../interfaces/external-starship.interface';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';

describe('StarshipService', () => {
  let service: StarshipService;
  let starshipRepository: StarshipRepository;
  let starshipMapper: StarshipMapper;
  let httpClient: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipService,
        {
          provide: StarshipRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            saveStarshipInCache: jest.fn(),
            saveListOfStarshipsInCache: jest.fn(),
          },
        },
        {
          provide: StarshipMapper,
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

    service = module.get<StarshipService>(StarshipService);
    starshipRepository = module.get<StarshipRepository>(StarshipRepository);
    starshipMapper = module.get<StarshipMapper>(StarshipMapper);
    httpClient = module.get<HttpClientService>(HttpClientService);
  });

  describe('findOne', () => {
    it('should return cached starship details if found in cache', async () => {
      const id = '1';
      const starshipResponse: ExternalItemResponse<ExternalStarship> = {
        message: 'OK',
        result: {
          properties: {
            name: 'Millennium Falcon',
            model: 'YT-1300 light freighter',
            manufacturer: 'Corellian Engineering Corporation',
            cost_in_credits: '100000',
            length: '34.37',
            max_atmosphering_speed: '1050',
            crew: '4',
            passengers: '6',
            cargo_capacity: '100000',
            consumables: '2 months',
            hyperdrive_rating: '0.5',
            MGLT: '75',
            starship_class: 'Light freighter',
            created: '2014-12-10T16:59:45.094000Z',
            edited: '2014-12-20T21:23:49.880000Z',
            url: 'https://swapi.dev/api/starships/10/',
            pilots: [],
          },
          description: '',
          _id: '',
          uid: '1',
          __v: 0,
        },
      };
      const starshipDetailsDto = new StarshipDetailsDto();

      jest
        .spyOn(starshipRepository, 'findOne')
        .mockResolvedValue(starshipResponse);
      jest
        .spyOn(starshipMapper, 'mapDetailsToDTO')
        .mockReturnValue(starshipDetailsDto);

      const result = await service.findOne(id);

      expect(starshipRepository.findOne).toHaveBeenCalledWith(id);
      expect(starshipMapper.mapDetailsToDTO).toHaveBeenCalledWith(
        starshipResponse,
      );
      expect(result).toBe(starshipDetailsDto);
    });

    it('should fetch starship details from external API if not found in cache', async () => {
      const id = '1';
      const starshipResponse: ExternalItemResponse<ExternalStarship> = {
        message: 'OK',
        result: {
          properties: {
            name: 'Millennium Falcon',
            model: 'YT-1300 light freighter',
            manufacturer: 'Corellian Engineering Corporation',
            cost_in_credits: '100000',
            length: '34.37',
            max_atmosphering_speed: '1050',
            crew: '4',
            passengers: '6',
            cargo_capacity: '100000',
            consumables: '2 months',
            hyperdrive_rating: '0.5',
            MGLT: '75',
            starship_class: 'Light freighter',
            created: '2014-12-10T16:59:45.094000Z',
            edited: '2014-12-20T21:23:49.880000Z',
            url: 'https://swapi.dev/api/starships/10/',
            pilots: [],
          },
          description: '',
          _id: '',
          uid: '1',
          __v: 0,
        },
      };
      const starshipDetailsDto = new StarshipDetailsDto();

      jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(httpClient, 'getOne').mockResolvedValue(starshipResponse);
      jest
        .spyOn(starshipRepository, 'saveStarshipInCache')
        .mockImplementation();
      jest
        .spyOn(starshipMapper, 'mapDetailsToDTO')
        .mockReturnValue(starshipDetailsDto);

      const result = await service.findOne(id);

      expect(starshipRepository.findOne).toHaveBeenCalledWith(id);
      expect(httpClient.getOne).toHaveBeenCalledWith(`starships/${id}`);
      expect(starshipRepository.saveStarshipInCache).toHaveBeenCalledWith(
        starshipResponse,
      );
      expect(starshipMapper.mapDetailsToDTO).toHaveBeenCalledWith(
        starshipResponse,
      );
      expect(result).toBe(starshipDetailsDto);
    });
  });

  describe('findAll', () => {
    it('should return cached starships list if found in cache', async () => {
      const page = 1;
      const limit = 10;
      const cachedStarships: ExternalListResponse<ExternalStarship> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Millennium Falcon',
            model: 'YT-1300 light freighter',
            manufacturer: 'Corellian Engineering Corporation',
            cost_in_credits: '100000',
            length: '34.37',
            max_atmosphering_speed: '1050',
            crew: '4',
            passengers: '6',
            cargo_capacity: '100000',
            consumables: '2 months',
            hyperdrive_rating: '0.5',
            MGLT: '75',
            starship_class: 'Light freighter',
            created: '2014-12-10T16:59:45.094000Z',
            edited: '2014-12-20T21:23:49.880000Z',
            url: 'https://swapi.dev/api/starships/10/',
            pilots: [],
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const starshipsListDto = new StarshipsListDto();

      jest
        .spyOn(starshipRepository, 'findAll')
        .mockResolvedValue(cachedStarships);
      jest
        .spyOn(starshipMapper, 'mapListToDTO')
        .mockReturnValue(starshipsListDto);

      const result = await service.findAll(page, limit);

      expect(starshipRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(starshipMapper.mapListToDTO).toHaveBeenCalledWith(
        cachedStarships,
        {
          limit,
          page,
        },
      );
      expect(result).toBe(starshipsListDto);
    });

    it('should fetch starships list from external API if not found in cache', async () => {
      const page = 1;
      const limit = 10;
      const starshipsResponse: ExternalListResponse<ExternalStarship> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Millennium Falcon',
            model: 'YT-1300 light freighter',
            manufacturer: 'Corellian Engineering Corporation',
            cost_in_credits: '100000',
            length: '34.37',
            max_atmosphering_speed: '1050',
            crew: '4',
            passengers: '6',
            cargo_capacity: '100000',
            consumables: '2 months',
            hyperdrive_rating: '0.5',
            MGLT: '75',
            starship_class: 'Light freighter',
            created: '2014-12-10T16:59:45.094000Z',
            edited: '2014-12-20T21:23:49.880000Z',
            url: 'https://swapi.dev/api/starships/10/',
            pilots: [],
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const starshipsListDto = new StarshipsListDto();

      jest.spyOn(starshipRepository, 'findAll').mockResolvedValue(null);
      jest.spyOn(httpClient, 'getAll').mockResolvedValue(starshipsResponse);
      jest
        .spyOn(starshipRepository, 'saveListOfStarshipsInCache')
        .mockImplementation();
      jest
        .spyOn(starshipMapper, 'mapListToDTO')
        .mockReturnValue(starshipsListDto);

      const result = await service.findAll(page, limit);

      expect(starshipRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(httpClient.getAll).toHaveBeenCalledWith('starships', {
        page,
        limit,
      });
      expect(
        starshipRepository.saveListOfStarshipsInCache,
      ).toHaveBeenCalledWith(starshipsResponse, page, limit);
      expect(starshipMapper.mapListToDTO).toHaveBeenCalledWith(
        starshipsResponse,
        {
          limit,
          page,
        },
      );
      expect(result).toBe(starshipsListDto);
    });
  });
});
