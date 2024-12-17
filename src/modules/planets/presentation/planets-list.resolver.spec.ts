import { Test, TestingModule } from '@nestjs/testing';
import { PlanetsListResolver } from './planets-list.resolver';
import { PlanetService } from '../application/planet.service';
import { PlanetsListDto } from '../dto/planets-list.dto';

describe('PlanetsListResolver', () => {
  let resolver: PlanetsListResolver;
  let service: PlanetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsListResolver,
        {
          provide: PlanetService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PlanetsListResolver>(PlanetsListResolver);
    service = module.get<PlanetService>(PlanetService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getPlanetsList', () => {
    it('should return a list of planets', async () => {
      const result: PlanetsListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getPlanetsList('1', 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should use default values for page and limit', async () => {
      const result: PlanetsListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getPlanetsList()).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });
});
