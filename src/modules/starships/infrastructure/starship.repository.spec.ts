import { TestingModule, Test } from '@nestjs/testing';
import { StarshipRepository } from './starship.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalStarship } from '../interfaces/external-starship.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { StarshipDetailsDto } from '../dto/starship-details.dto';

describe('StarshipRepository', () => {
  let repository: StarshipRepository;
  let detailsResponse: ExternalItemResponse<ExternalStarship>;
  let listResponse: ExternalListResponse<ExternalStarship>;
  let starship: StarshipDetailsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [StarshipRepository],
    }).compile();

    repository = module.get<StarshipRepository>(StarshipRepository);
    starship = new StarshipDetailsDto();
    starship.id = '1';
    starship.name = 'Millennium Falcon';
    starship.model = 'YT-1300 light freighter';
    starship.starship_class = 'Light freighter';
    starship.manufacturer = 'Corellian Engineering Corporation';
    starship.cost_in_credits = '100000';
    starship.length = '34.37';
    starship.crew = '4';
    starship.passengers = '6';
    starship.max_atmosphering_speed = '1050';
    starship.hyperdrive_rating = '0.5';
    starship.MGLT = '75';
    starship.cargo_capacity = '100000';
    starship.consumables = '2 months';

    detailsResponse = {
      message: '',
      result: {
        properties: starship,
        description: '',
        _id: '',
        uid: '1',
        __v: 0,
      },
    };

    listResponse = {
      message: 'Success',
      results: [starship],
      total_records: 2,
      total_pages: 1,
      previous: null,
      next: null,
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of starships', async () => {
    await repository.saveListOfStarshipsInCache(listResponse, 1);
    const starships = await repository.findAll(1);
    expect(starships.results).toBeInstanceOf(Array);
  });

  it('should return a single starship', async () => {
    await repository.saveStarshipInCache(detailsResponse);
    const starship = await repository.findOne('1');
    expect(starship).toBeInstanceOf(Object);
    expect(starship.result.uid).toBe('1');
  });
});
