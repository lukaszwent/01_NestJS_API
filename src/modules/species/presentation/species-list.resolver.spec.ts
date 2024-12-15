import { TestingModule, Test } from '@nestjs/testing';
import { SpeciesService } from '../application/species.service';
import { SpeciesListResolver } from './species-list.resolver';
import { SpeciesListDto } from '../dto/species-list.dto';

describe('SpeciesListResolver', () => {
  let resolver: SpeciesListResolver;
  let speciesService: SpeciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeciesListResolver,
        {
          provide: SpeciesService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<SpeciesListResolver>(SpeciesListResolver);
    speciesService = module.get<SpeciesService>(SpeciesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return a list of species', async () => {
    const result: SpeciesListDto = new SpeciesListDto();
    result.count = 0;
    result.isNext = false;
    result.isPrevious = false;
    result.results = [];
    result.page = 1;
    result.pages = 1;

    jest.spyOn(speciesService, 'findAll').mockResolvedValue(result);

    expect(await resolver.getSpeciesList('1', '')).toEqual({
      count: 0,
      isNext: false,
      isPrevious: false,
      results: [],
      page: 1,
      pages: 1,
    });
    expect(speciesService.findAll).toHaveBeenCalledWith(1, '');
  });
});
