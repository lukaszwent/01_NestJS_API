import {
  CustomFilmsResponse,
  CustomFilmsResult,
} from './../interfaces/custom-films-response.interface';
import { TestingModule, Test } from '@nestjs/testing';
import { FilmRepository } from './film.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { FilmDetailsDto } from '../dto/film-details.dto';

describe('FilmRepository', () => {
  let repository: FilmRepository;
  let detailsResponse: CustomFilmsResult;
  let listResponse: CustomFilmsResponse;
  let film: FilmDetailsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [FilmRepository],
    }).compile();

    repository = module.get<FilmRepository>(FilmRepository);
    film = new FilmDetailsDto();
    film.id = '1';
    film.title = 'A New Hope';
    film.episode_id = 4;
    film.opening_crawl = 'It is a period of civil war...';
    film.director = 'George Lucas';
    film.producer = 'Gary Kurtz, Rick McCallum';
    film.release_date = '1977-05-25';
    film.characters = ['https://swapi.dev/api/people/1/'];
    film.planets = ['https://swapi.dev/api/planets/1/'];
    film.starships = ['https://swapi.dev/api/starships/2/'];
    film.vehicles = ['https://swapi.dev/api/vehicles/4/'];
    film.species = ['https://swapi.dev/api/species/1/'];
    film.created = '2014-12-10T14:23:31.880000Z';
    film.edited = '2014-12-20T19:49:45.256000Z';
    film.url = 'https://swapi.dev/api/films/1/';

    detailsResponse = {
      properties: film,
      description: '',
      _id: '',
      uid: '1',
      __v: 0,
    };

    listResponse = {
      message: 'Success',
      result: [detailsResponse],
      total_records: 2,
      total_pages: 1,
      previous: null,
      next: null,
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of films', async () => {
    await repository.saveListOfFilmsInCache(listResponse, 1);
    const films = await repository.findAll(1);
    expect(films.result).toBeInstanceOf(Array);
  });

  it('should return a single film', async () => {
    const detailsResponse = {
      message: '',
      result: {
        properties: film,
        description: '',
        _id: '',
        uid: '1',
        __v: 0,
      },
    };

    await repository.saveFilmInCache(detailsResponse);
    const cachedFilm = await repository.findOne('1');
    expect(cachedFilm).toBeInstanceOf(Object);
    expect(cachedFilm.result.uid).toBe('1');
  });
});
