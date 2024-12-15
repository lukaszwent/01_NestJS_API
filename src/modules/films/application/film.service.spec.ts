import { HttpService } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { FilmDetailsDto } from '../dto/film-details.dto';
import { FilmsListDto } from '../dto/films-list.dto';
import { Film } from '../entity/film.entity';
import { FilmRepository } from '../infrastructure/film.repository';
import { FilmService } from './film.service';
import { SWFilmsResponse } from '../interfaces/sw-film-response.interface';

describe('FilmService', () => {
  let service: FilmService;
  let httpService: HttpService;
  let filmRepository: FilmRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: FilmRepository,
          useValue: {
            findOne: jest.fn(),
            saveFilmInCache: jest.fn(),
            findAll: jest.fn(),
            saveListOfFilmsInCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmService>(FilmService);
    httpService = module.get<HttpService>(HttpService);
    filmRepository = module.get<FilmRepository>(FilmRepository);
  });

  it('should return cached film if found', async () => {
    const id = '1';
    const cachedFilm = new FilmDetailsDto();
    jest.spyOn(filmRepository, 'findOne').mockResolvedValue(cachedFilm);

    const result = await service.findOne(id);

    expect(result).toBe(cachedFilm);
    expect(filmRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch film from API if not cached', async () => {
    const id = '1';
    const film = new Film();
    const response: AxiosResponse<Film> = {
      data: film,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(filmRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest.spyOn(filmRepository, 'saveFilmInCache').mockResolvedValue();

    const result = await service.findOne(id);

    expect(result).toBe(film);
    expect(filmRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/films/${id}`,
    );
    expect(filmRepository.saveFilmInCache).toHaveBeenCalledWith(film);
  });

  it('should return cached films if found', async () => {
    const page = 1;
    const cachedFilms = new FilmsListDto();
    jest.spyOn(filmRepository, 'findAll').mockResolvedValue(cachedFilms);

    const result = await service.findAll(page, '');

    expect(result).toBe(cachedFilms);
    expect(filmRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch films from API if not cached', async () => {
    const page = 1;
    const films = [new Film()];
    const response: AxiosResponse<SWFilmsResponse> = {
      data: { results: films, count: 1, next: null, previous: null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(filmRepository, 'findAll').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest.spyOn(filmRepository, 'saveListOfFilmsInCache').mockResolvedValue();

    const result = await service.findAll(page, '');

    expect(result.results).toBe(films);
    expect(filmRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/films`,
      {
        params: { page },
      },
    );
    expect(filmRepository.saveListOfFilmsInCache).toHaveBeenCalledWith(
      response.data,
      '',
    );
  });

  it('should return character with most mentions from cached films', async () => {
    const films: FilmsListDto = {
      count: 2,
      page: 1,
      pages: 1,
      isNext: false,
      isPrevious: false,
      results: [
        {
          opening_crawl:
            'Luke Skywalker is a Jedi. Luke Skywalker fights Darth Vader.',
          id: '',
          title: '',
          episodeId: '',
          director: '',
          producer: '',
          release_date: '',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          url: '',
          created: '',
          edited: '',
        },
        {
          opening_crawl:
            'Leia Organa is a princess. Luke Skywalker is her brother.',
          id: '',
          title: '',
          episodeId: '',
          director: '',
          producer: '',
          release_date: '',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          url: '',
          created: '',
          edited: '',
        },
      ],
    };
    const peopleResponse: AxiosResponse = {
      data: [
        { name: 'Luke Skywalker' },
        { name: 'Leia Organa' },
        { name: 'Darth Vader' },
      ],
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
      },
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(filmRepository, 'findAll').mockResolvedValue(films);
    jest.spyOn(httpService, 'get').mockReturnValue(of(peopleResponse));

    const result = await service.getCharacterWithMostMentions();

    expect(result).toEqual(['Luke Skywalker']);
    expect(filmRepository.findAll).toHaveBeenCalled();
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/people/`,
    );
  });

  it('should fetch films from API if not cached and return character with most mentions', async () => {
    const films: FilmsListDto = {
      count: 2,
      page: 1,
      pages: 1,
      isNext: false,
      isPrevious: false,
      results: [
        {
          opening_crawl:
            'Luke Skywalker is a Jedi. Luke Skywalker fights Darth Vader.',
          id: '',
          title: '',
          episodeId: '',
          director: '',
          producer: '',
          release_date: '',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          url: '',
          created: '',
          edited: '',
        },
        {
          opening_crawl:
            'Leia Organa is a princess. Luke Skywalker is her brother.',
          id: '',
          title: '',
          episodeId: '',
          director: '',
          producer: '',
          release_date: '',
          characters: [],
          planets: [],
          starships: [],
          vehicles: [],
          species: [],
          url: '',
          created: '',
          edited: '',
        },
      ],
    };
    const peopleResponse: AxiosResponse = {
      data: [
        { name: 'Luke Skywalker' },
        { name: 'Leia Organa' },
        { name: 'Darth Vader' },
      ],
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
      },
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(filmRepository, 'findAll').mockResolvedValue(films);
    jest.spyOn(httpService, 'get').mockReturnValue(of(peopleResponse));

    const result = await service.getCharacterWithMostMentions();

    expect(result).toEqual(['Luke Skywalker']);
    expect(filmRepository.findAll).toHaveBeenCalled();
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/people/`,
    );
  });
});
