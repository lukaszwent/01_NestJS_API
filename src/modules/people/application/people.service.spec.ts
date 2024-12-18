import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { PeopleRepository } from '../infrastructure/people.repository';
import { PeopleMapper } from './../people.mapper';
import { HttpClientService } from '../../../common/services/http-client.service';
import { PeopleListDto } from '../dto/people-list.dto';
import { ExternalPeople } from '../interfaces/external-people.interface';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';

describe('PeopleService', () => {
  let service: PeopleService;
  let peopleRepository: PeopleRepository;
  let peopleMapper: PeopleMapper;
  let httpClient: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: PeopleRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            savePeopleInCache: jest.fn(),
            saveListOfPeopleInCache: jest.fn(),
          },
        },
        {
          provide: PeopleMapper,
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

    service = module.get<PeopleService>(PeopleService);
    peopleRepository = module.get<PeopleRepository>(PeopleRepository);
    peopleMapper = module.get<PeopleMapper>(PeopleMapper);
    httpClient = module.get<HttpClientService>(HttpClientService);
  });

  describe('findAll', () => {
    it('should return cached people list if found in cache', async () => {
      const page = 1;
      const limit = 10;
      const cachedPeople: ExternalListResponse<ExternalPeople> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.dev/api/planets/1/',
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/people/1/',
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const peopleListDto = new PeopleListDto();

      jest.spyOn(peopleRepository, 'findAll').mockResolvedValue(cachedPeople);
      jest.spyOn(peopleMapper, 'mapListToDTO').mockReturnValue(peopleListDto);

      const result = await service.findAll(page, limit);

      expect(peopleRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(peopleMapper.mapListToDTO).toHaveBeenCalledWith(cachedPeople, {
        limit,
        page,
      });
      expect(result).toBe(peopleListDto);
    });

    it('should fetch people list from external API if not found in cache', async () => {
      const page = 1;
      const limit = 10;
      const peopleResponse: ExternalListResponse<ExternalPeople> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.dev/api/planets/1/',
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/people/1/',
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const peopleListDto = new PeopleListDto();

      jest.spyOn(peopleRepository, 'findAll').mockResolvedValue(null);
      jest.spyOn(httpClient, 'getAll').mockResolvedValue(peopleResponse);
      jest
        .spyOn(peopleRepository, 'saveListOfPeopleInCache')
        .mockImplementation();
      jest.spyOn(peopleMapper, 'mapListToDTO').mockReturnValue(peopleListDto);

      const result = await service.findAll(page, limit);

      expect(peopleRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(httpClient.getAll).toHaveBeenCalledWith('people', {
        page,
        limit,
      });
      expect(peopleRepository.saveListOfPeopleInCache).toHaveBeenCalledWith(
        peopleResponse,
        page,
        limit,
      );
      expect(peopleMapper.mapListToDTO).toHaveBeenCalledWith(peopleResponse, {
        limit,
        page,
      });
      expect(result).toBe(peopleListDto);
    });
  });
});
