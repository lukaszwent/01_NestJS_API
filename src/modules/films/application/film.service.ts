import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { FilmDetailsDto } from '../dto/film-details.dto';
import { FilmsListDto } from '../dto/films-list.dto';
import { Film } from '../entity/film.entity';
import { FilmRepository } from '../infrastructure/film.repository';

@Injectable()
export class FilmService {
  private readonly logger = new Logger(FilmService.name);

  constructor(
    private http: HttpService,
    private filmRepository: FilmRepository,
  ) {}

  async findOne(id: string): Promise<FilmDetailsDto> {
    const cachedFilm = await this.filmRepository.findOne(id);

    if (cachedFilm) {
      return cachedFilm;
    }

    const { data: film } = await firstValueFrom(
      this.http.get<Film>(process.env.API_URL + '/films/' + id).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching film';
        }),
      ),
    );

    this.filmRepository.saveFilmInCache(film);

    return film;
  }

  async findAll(page?: number, query?: string): Promise<FilmsListDto> {
    const cachedFilms = await this.filmRepository.findAll(page, query);

    if (cachedFilms) {
      return cachedFilms;
    }

    const params = {
      page: page,
      search: query,
    };

    if (!page) {
      delete params.page;
    }

    if (!query) {
      delete params.search;
    }

    const { data } = await firstValueFrom(
      this.http.get(process.env.API_URL + '/films', { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching films';
        }),
      ),
    );

    const filmsListDto = new FilmsListDto();
    filmsListDto.results = data.results;
    filmsListDto.isNext = data.next !== null;
    filmsListDto.isPrevious = data.previous !== null;
    filmsListDto.count = data.count;
    filmsListDto.page = page;
    filmsListDto.pages = Math.ceil(data.count / 10);

    this.filmRepository.saveListOfFilmsInCache(data, query);

    return filmsListDto;
  }

  async getUniqueWordPairs(): Promise<(string | number)[][]> {
    let films = await this.filmRepository.findAll();

    if (!films) {
      ({ data: films } = await firstValueFrom(
        this.http.get(process.env.API_URL + '/films/'),
      ));
    }

    const openings = films.results.map((film) => film.opening_crawl);
    const wordCount: Record<string, number> = {};

    openings.forEach((opening) => {
      const words = opening.split(/[\s\x00-\x1F]+/).filter((word) => word);

      words.forEach((word) => {
        const lowerCaseWord = word.toLowerCase();
        wordCount[lowerCaseWord] = (wordCount[lowerCaseWord] || 0) + 1;
      });
    });

    this.filmRepository.saveListOfFilmsInCache(films);

    return Object.entries(wordCount);
  }

  async getCharacterWithMostMentions(): Promise<string[]> {
    const films = await this.findAll();

    const openings = films.results.map((film) => film.opening_crawl);

    // TODO Replace with PeopleService
    const peopleResponse = await firstValueFrom(
      this.http.get(`${process.env.API_URL}/people/`),
    );
    const nameCount: Record<string, number> = {};

    peopleResponse.data.forEach((person) => {
      const nameRegex = new RegExp(`\\b${person.name}\\b`, 'gi');
      let count = 0;
      openings.forEach((opening) => {
        const matches = opening.match(nameRegex);
        if (matches) {
          count += matches.length;
        }
      });
      if (count > 0) {
        nameCount[person.name] = count;
      }
    });

    const maxCount = Math.max(...Object.values(nameCount));
    return Object.keys(nameCount).filter(
      (name) => nameCount[name] === maxCount,
    );
  }
}
