import { TestingModule, Test } from '@nestjs/testing';
import { CacheModule } from '@nestjs/cache-manager';
import { FilmRepository } from './film.repository';

describe('FilmRepository', () => {
  let repository: FilmRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [FilmRepository],
    }).compile();

    repository = module.get<FilmRepository>(FilmRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of films', async () => {
    await repository.saveListOfFilmsInCache(
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
    const films = await repository.findAll(1, '');
    expect(films.results).toBeInstanceOf(Array);
  });

  it('should return a single film', async () => {
    await repository.saveFilmInCache({
      id: '1',
      title: 'A New Hope',
      director: 'George Lucas',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      episodeId: '1',
      opening_crawl:
        'It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.',
      characters: ['Luke Skywalker', 'Darth Vader', 'Leia Organa'],
      planets: ['Tatooine', 'Alderaan', 'Yavin IV'],
      starships: ['Millennium Falcon', 'X-wing', 'TIE Fighter'],
      vehicles: ['Sand Crawler', 'T-16 skyhopper'],
      species: ['Human', 'Droid', 'Wookiee'],
      url: 'https://swapi.dev/api/films/1/',
      created: '2014-12-10T14:23:31.880000Z',
      edited: '2014-12-20T19:49:45.256000Z',
    });
    const film = await repository.findOne('1');
    expect(film).toBeInstanceOf(Object);
    expect(film.id).toBe('1');
  });
});
