import { Test, TestingModule } from '@nestjs/testing';
import { FilmsListResolver } from './films-list.resolver';
import { FilmService } from '../application/film.service';
import { FilmsListDto } from '../dto/films-list.dto';

describe('FilmsListResolver', () => {
  let resolver: FilmsListResolver;
  let service: FilmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsListResolver,
        {
          provide: FilmService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<FilmsListResolver>(FilmsListResolver);
    service = module.get<FilmService>(FilmService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getFilmsList', () => {
    it('should return a list of films', async () => {
      const result: FilmsListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getFilmsList(1, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should use default values for page and limit', async () => {
      const result: FilmsListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getFilmsList()).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });
});
