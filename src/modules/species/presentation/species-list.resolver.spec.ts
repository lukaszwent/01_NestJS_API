import { Test, TestingModule } from '@nestjs/testing';
import { SpeciesListResolver } from './species-list.resolver';
import { SpeciesService } from '../application/species.service';
import { SpeciesListDto } from '../dto/species-list.dto';

describe('SpeciesListResolver', () => {
  let resolver: SpeciesListResolver;
  let service: SpeciesService;

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
    service = module.get<SpeciesService>(SpeciesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getSpeciesList', () => {
    it('should return a list of species', async () => {
      const result: SpeciesListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getSpeciesList(1, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should use default values for page and limit', async () => {
      const result: SpeciesListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getSpeciesList()).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });
});
