import { TestingModule, Test } from '@nestjs/testing';
import { FilmService } from '../application/film.service';
import { FilmsListResolver } from './films-list.resolver';
import { FilmsListDto } from '../dto/films-list.dto';

describe('FilmsListResolver', () => {
  let resolver: FilmsListResolver;
  let filmService: FilmService;

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
    filmService = module.get<FilmService>(FilmService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getFilmsList', () => {
    it('should return a list of films', async () => {
      const result: FilmsListDto = new FilmsListDto();
      result.count = 0;
      result.isNext = false;
      result.isPrevious = false;
      result.results = [];
      result.page = 1;
      result.pages = 1;

      jest.spyOn(filmService, 'findAll').mockResolvedValue(result);

      expect(await resolver.getFilmsList('1', '')).toEqual({
        count: 0,
        isNext: false,
        isPrevious: false,
        results: [],
        page: 1,
        pages: 1,
      });
      expect(filmService.findAll).toHaveBeenCalledWith(1, '');
    });

    describe('FilmsListResolver', () => {
      let resolver: FilmsListResolver;
      let filmService: FilmService;

      beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            FilmsListResolver,
            {
              provide: FilmService,
              useValue: {
                findAll: jest.fn(),
                getUniqueWordPairs: jest.fn(),
              },
            },
          ],
        }).compile();

        resolver = module.get<FilmsListResolver>(FilmsListResolver);
        filmService = module.get<FilmService>(FilmService);
      });

      it('should be defined', () => {
        expect(resolver).toBeDefined();
      });

      describe('getFilmsList', () => {
        it('should return a list of films', async () => {
          const result: FilmsListDto = new FilmsListDto();
          result.count = 0;
          result.isNext = false;
          result.isPrevious = false;
          result.results = [];
          result.page = 1;
          result.pages = 1;

          jest.spyOn(filmService, 'findAll').mockResolvedValue(result);

          expect(await resolver.getFilmsList('1', '')).toEqual({
            count: 0,
            isNext: false,
            isPrevious: false,
            results: [],
            page: 1,
            pages: 1,
          });
          expect(filmService.findAll).toHaveBeenCalledWith(1, '');
        });
      });

      describe('getUniqueWordPairs', () => {
        it('should return unique word pairs', async () => {
          const result = [
            ['word1', 1],
            ['word2', 2],
          ];

          jest
            .spyOn(filmService, 'getUniqueWordPairs')
            .mockResolvedValue(result);

          expect(await resolver.getUniqueWordPairs()).toEqual(result);
          expect(filmService.getUniqueWordPairs).toHaveBeenCalled();
        });

        describe('getCharacterWithMostMentions', () => {
          it('should return the character with most mentions', async () => {
            const result = ['character1', 'character2'];

            jest
              .spyOn(filmService, 'getCharacterWithMostMentions')
              .mockResolvedValue(result);

            expect(await resolver.getCharacterWithMostMentions()).toEqual(
              result,
            );
            expect(filmService.getCharacterWithMostMentions).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
