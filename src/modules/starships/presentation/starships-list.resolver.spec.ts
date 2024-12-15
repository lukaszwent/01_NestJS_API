import { TestingModule, Test } from '@nestjs/testing';
import { StarshipService } from '../application/starship.service';
import { StarshipsListDto } from '../dto/starships-list.dto';
import { StarshipsListResolver } from './starships-list.resolver';

describe('StarshipsListResolver', () => {
  let resolver: StarshipsListResolver;
  let starshipService: StarshipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipsListResolver,
        {
          provide: StarshipService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<StarshipsListResolver>(StarshipsListResolver);
    starshipService = module.get<StarshipService>(StarshipService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return a list of starships', async () => {
    const result: StarshipsListDto = new StarshipsListDto();
    result.count = 0;
    result.isNext = false;
    result.isPrevious = false;
    result.results = [];
    result.page = 1;
    result.pages = 1;

    jest.spyOn(starshipService, 'findAll').mockResolvedValue(result);

    expect(await resolver.getStarshipsList('1', '')).toEqual({
      count: 0,
      isNext: false,
      isPrevious: false,
      results: [],
      page: 1,
      pages: 1,
    });
    expect(starshipService.findAll).toHaveBeenCalledWith(1, '');
  });
});
