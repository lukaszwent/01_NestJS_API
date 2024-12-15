import { HttpService } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { SpeciesDetailsDto } from '../dto/species-details.dto';
import { Species } from '../entity/species.entity';
import { SpeciesRepository } from '../infrastructure/species.repository';
import { SpeciesService } from './species.service';
import { SpeciesListDto } from '../dto/species-list.dto';
import { SWSpeciesResponse } from '../interfaces/sw-species-response.interface';

describe('SpeciesService', () => {
  let service: SpeciesService;
  let httpService: HttpService;
  let speciesRepository: SpeciesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: SpeciesRepository,
          useValue: {
            findOne: jest.fn(),
            saveSpeciesInCache: jest.fn(),
            findAll: jest.fn(),
            saveListOfSpeciesInCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SpeciesService>(SpeciesService);
    httpService = module.get<HttpService>(HttpService);
    speciesRepository = module.get<SpeciesRepository>(SpeciesRepository);
  });

  it('should return cached species if found', async () => {
    const id = '1';
    const cachedSpecies = new SpeciesDetailsDto();
    jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(cachedSpecies);

    const result = await service.findOne(id);

    expect(result).toBe(cachedSpecies);
    expect(speciesRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch species from API if not cached', async () => {
    const id = '1';
    const species = new Species();
    const response: AxiosResponse<Species> = {
      data: species,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(speciesRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest.spyOn(speciesRepository, 'saveSpeciesInCache').mockResolvedValue();

    const result = await service.findOne(id);

    expect(result).toBe(species);
    expect(speciesRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/species/${id}`,
    );
    expect(speciesRepository.saveSpeciesInCache).toHaveBeenCalledWith(species);
  });

  it('should return cached species if found', async () => {
    const page = 1;
    const cachedSpecies = new SpeciesListDto();
    jest.spyOn(speciesRepository, 'findAll').mockResolvedValue(cachedSpecies);

    const result = await service.findAll(page, '');

    expect(result).toBe(cachedSpecies);
    expect(speciesRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch species from API if not cached', async () => {
    const page = 1;
    const species = [new Species()];
    const response: AxiosResponse<SWSpeciesResponse> = {
      data: { results: species, count: 1, next: null, previous: null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(speciesRepository, 'findAll').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest
      .spyOn(speciesRepository, 'saveListOfSpeciesInCache')
      .mockResolvedValue();

    const result = await service.findAll(page, '');

    expect(result.results).toBe(species);
    expect(speciesRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/species`,
      {
        params: { page },
      },
    );
    expect(speciesRepository.saveListOfSpeciesInCache).toHaveBeenCalledWith(
      response.data,
      '',
    );
  });
});
