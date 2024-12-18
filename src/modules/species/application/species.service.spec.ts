import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesService } from './species.service';
import { SpeciesRepository } from '../infrastructure/species.repository';
import { SpeciesMapper } from '../species.mapper';
import { HttpClientService } from '../../../common/services/http-client.service';
import { SpeciesDetailsDto } from '../dto/species-details.dto';
import { SpeciesListDto } from '../dto/species-list.dto';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { ExternalSpecies } from '../interfaces/external-species.interface';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';

describe('SpeciesService', () => {
  let service: SpeciesService;
  let speciesRepository: SpeciesRepository;
  let speciesMapper: SpeciesMapper;
  let httpClient: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesService,
        {
          provide: SpeciesRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            saveSpeciesInCache: jest.fn(),
            saveListOfSpeciesInCache: jest.fn(),
          },
        },
        {
          provide: SpeciesMapper,
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

    service = module.get<SpeciesService>(SpeciesService);
    speciesRepository = module.get<SpeciesRepository>(SpeciesRepository);
    speciesMapper = module.get<SpeciesMapper>(SpeciesMapper);
    httpClient = module.get<HttpClientService>(HttpClientService);
  });

  describe('findOne', () => {
    it('should return cached species details if found in cache', async () => {
      const id = '1';
      const speciesResponse: ExternalItemResponse<ExternalSpecies> = {
        message: 'OK',
        result: {
          properties: {
            name: 'Human',
            classification: 'Mammal',
            designation: 'Sentient',
            average_height: '180',
            average_lifespan: '80',
            hair_colors: 'varied',
            skin_colors: 'varied',
            eye_colors: 'varied',
            homeworld: 'Earth',
            language: 'varied',
            people: [],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/species/1/',
          },
          description: '',
          _id: '',
          uid: '1',
          __v: 0,
        },
      };
      const speciesDetailsDto = new SpeciesDetailsDto();

      jest
        .spyOn(speciesRepository, 'findOne')
        .mockResolvedValue(speciesResponse);
      jest
        .spyOn(speciesMapper, 'mapDetailsToDTO')
        .mockReturnValue(speciesDetailsDto);

      const result = await service.findOne(id);

      expect(speciesRepository.findOne).toHaveBeenCalledWith(id);
      expect(speciesMapper.mapDetailsToDTO).toHaveBeenCalledWith(
        speciesResponse,
      );
      expect(result).toBe(speciesDetailsDto);
    });

    it('should fetch species details from external API if not found in cache', async () => {
      const id = '1';
      const speciesResponse: ExternalItemResponse<ExternalSpecies> = {
        message: 'OK',
        result: {
          properties: {
            name: 'Human',
            classification: 'Mammal',
            designation: 'Sentient',
            average_height: '180',
            average_lifespan: '80',
            hair_colors: 'varied',
            skin_colors: 'varied',
            eye_colors: 'varied',
            homeworld: 'Earth',
            language: 'varied',
            people: [],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/species/1/',
          },
          description: '',
          _id: '',
          uid: '1',
          __v: 0,
        },
      };
      const speciesDetailsDto = new SpeciesDetailsDto();

      jest.spyOn(httpClient, 'getOne').mockResolvedValue(speciesResponse);
      jest
        .spyOn(speciesMapper, 'mapDetailsToDTO')
        .mockReturnValue(speciesDetailsDto);
      jest.spyOn(speciesRepository, 'saveSpeciesInCache').mockResolvedValue();

      const result = await service.findOne(id);

      expect(httpClient.getOne).toHaveBeenCalledWith(`species/${id}`);
      expect(speciesMapper.mapDetailsToDTO).toHaveBeenCalledWith(
        speciesResponse,
      );
      expect(speciesRepository.saveSpeciesInCache).toHaveBeenCalledWith(
        speciesResponse,
      );
      expect(result).toBe(speciesDetailsDto);
    });
  });
});
