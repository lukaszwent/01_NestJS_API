import { TestingModule, Test } from '@nestjs/testing';
import { SpeciesRepository } from './species.repository';
import { CacheModule } from '@nestjs/cache-manager';

describe('SpeciesRepository', () => {
  let repository: SpeciesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [SpeciesRepository],
    }).compile();

    repository = module.get<SpeciesRepository>(SpeciesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of species', async () => {
    await repository.saveListOfSpeciesInCache(
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
    const species = await repository.findAll(1, '');
    expect(species.results).toBeInstanceOf(Array);
  });

  it('should return a single species', async () => {
    await repository.saveSpeciesInCache({
      id: '1',
      name: '',
      classification: '',
      designation: '',
      average_height: '',
      skin_colors: '',
      hair_colors: '',
      eye_colors: '',
      average_lifespan: '',
      homeworld: '',
      language: '',
      people: [],
      films: [],
      created: '',
      edited: '',
      url: '',
    });
    const species = await repository.findOne('1');
    expect(species).toBeInstanceOf(Object);
    expect(species.id).toBe('1');
  });
});
