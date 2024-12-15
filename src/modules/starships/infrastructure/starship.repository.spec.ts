import { TestingModule, Test } from '@nestjs/testing';
import { StarshipRepository } from './starship.repository';
import { CacheModule } from '@nestjs/cache-manager';

describe('StarshipRepository', () => {
  let repository: StarshipRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [StarshipRepository],
    }).compile();

    repository = module.get<StarshipRepository>(StarshipRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of starships', async () => {
    await repository.saveListOfStarshipsInCache(
      {
        count: 0,
        isNext: false,
        isPrevious: false,
        results: [],
        page: 1,
        pages: 1,
      },
      '',
    );
    const starships = await repository.findAll(1, '');
    expect(starships.results).toBeInstanceOf(Array);
  });

  it('should return a single starship', async () => {
    await repository.saveStarshipInCache({
      id: '1',
      name: '',
      model: '',
      manufacturer: '',
      cost_in_credits: '',
      length: '',
      max_atmosphering_speed: '',
      crew: '',
      passengers: '',
      cargo_capacity: '',
      consumables: '',
      hyperdrive_rating: '',
      MGLT: '',
      starship_class: '',
      pilots: [],
      films: [],
      created: '',
      edited: '',
      url: '',
    });
    const starship = await repository.findOne('1');
    expect(starship).toBeInstanceOf(Object);
    expect(starship.id).toBe('1');
  });
});
