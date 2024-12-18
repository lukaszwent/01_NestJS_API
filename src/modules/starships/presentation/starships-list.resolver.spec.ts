import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsListResolver } from './starships-list.resolver';
import { StarshipService } from '../application/starship.service';
import { StarshipsListDto } from '../dto/starships-list.dto';

describe('StarshipsListResolver', () => {
  let resolver: StarshipsListResolver;
  let service: StarshipService;

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
    service = module.get<StarshipService>(StarshipService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getStarshipsList', () => {
    it('should return a list of starships', async () => {
      const result: StarshipsListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getStarshipsList(1, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should use default values for page and limit', async () => {
      const result: StarshipsListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getStarshipsList()).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });
});
