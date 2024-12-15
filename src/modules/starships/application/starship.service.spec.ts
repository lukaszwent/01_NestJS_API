import { HttpService } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { StarshipDetailsDto } from '../dto/starship-details.dto';
import { Starship } from '../entity/starship.entity';
import { StarshipRepository } from '../infrastructure/starship.repository';
import { StarshipService } from './starship.service';
import { StarshipsListDto } from '../dto/starships-list.dto';
import { SWStarshipsResponse } from '../interfaces/sw-starship-response.interface';

describe('StarshipService', () => {
  let service: StarshipService;
  let httpService: HttpService;
  let starshipRepository: StarshipRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: StarshipRepository,
          useValue: {
            findOne: jest.fn(),
            saveStarshipInCache: jest.fn(),
            findAll: jest.fn(),
            saveListOfStarshipsInCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StarshipService>(StarshipService);
    httpService = module.get<HttpService>(HttpService);
    starshipRepository = module.get<StarshipRepository>(StarshipRepository);
  });

  it('should return cached starship if found', async () => {
    const id = '1';
    const cachedStarship = new StarshipDetailsDto();
    jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(cachedStarship);

    const result = await service.findOne(id);

    expect(result).toBe(cachedStarship);
    expect(starshipRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch starship from API if not cached', async () => {
    const id = '1';
    const starship = new Starship();
    const response: AxiosResponse<Starship> = {
      data: starship,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(starshipRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest.spyOn(starshipRepository, 'saveStarshipInCache').mockResolvedValue();

    const result = await service.findOne(id);

    expect(result).toBe(starship);
    expect(starshipRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/starships/${id}`,
    );
    expect(starshipRepository.saveStarshipInCache).toHaveBeenCalledWith(
      starship,
    );
  });

  it('should return cached starships if found', async () => {
    const page = 1;
    const cachedStarships = new StarshipsListDto();
    jest
      .spyOn(starshipRepository, 'findAll')
      .mockResolvedValue(cachedStarships);

    const result = await service.findAll(page, '');

    expect(result).toBe(cachedStarships);
    expect(starshipRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch starships from API if not cached', async () => {
    const page = 1;
    const starships = [new Starship()];
    const response: AxiosResponse<SWStarshipsResponse> = {
      data: { results: starships, count: 1, next: null, previous: null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(starshipRepository, 'findAll').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest
      .spyOn(starshipRepository, 'saveListOfStarshipsInCache')
      .mockResolvedValue();

    const result = await service.findAll(page, '');

    expect(result.results).toBe(starships);
    expect(starshipRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/starships`,
      {
        params: { page },
      },
    );
    expect(starshipRepository.saveListOfStarshipsInCache).toHaveBeenCalledWith(
      response.data,
      '',
    );
  });
});
