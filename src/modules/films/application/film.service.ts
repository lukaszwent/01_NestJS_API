import { FilmMapper } from '../film.mapper';
import { FilmRepository } from '../infrastructure/film.repository';
import { Injectable } from '@nestjs/common';
import { FilmsListDto } from '../dto/films-list.dto';
import { FilmDetailsDto } from '../dto/film-details.dto';
import { ExternalFilm } from '../interfaces/external-film.interface';
import { HttpClientService } from '../../../common/services/http-client.service';
import { PeopleService } from '../../people/application/people.service';
@Injectable()
export class FilmService {
  constructor(
    private filmRepository: FilmRepository,
    private filmMapper: FilmMapper,
    private httpClient: HttpClientService,
    private peopleService: PeopleService,
  ) {}

  async findOne(id: string): Promise<FilmDetailsDto> {
    const cachedFilm = await this.filmRepository.findOne(id);

    if (cachedFilm) {
      return this.filmMapper.mapDetailsToDTO(cachedFilm);
    }

    const film = await this.httpClient.getOne<ExternalFilm>(`films/${id}`);

    this.filmRepository.saveFilmInCache(film);

    return this.filmMapper.mapDetailsToDTO(film);
  }

  async findAll(page: number, limit: number): Promise<FilmsListDto> {
    const cachedFilms = await this.filmRepository.findAll(page, limit);

    if (cachedFilms) {
      return this.filmMapper.mapListToDTO(cachedFilms, { limit, page });
    }

    const params = {
      page: page,
      limit: limit,
    };

    if (!page) {
      delete params.page;
    }
    if (!limit) {
      delete params.limit;
    }

    const films = await this.httpClient.getAll<ExternalFilm>('films', params);

    const filmsListDto = this.filmMapper.mapListToDTO(films, {
      limit,
      page,
    });

    this.filmRepository.saveListOfFilmsInCache(films, page, limit);

    return filmsListDto;
  }

  async getUniqueWordPairs(): Promise<(string | number)[][]> {
    const cachedUniquePairs = await this.filmRepository.findUniqueWordPairs();

    if (cachedUniquePairs) {
      return cachedUniquePairs;
    }

    let films = await this.filmRepository.findAll();

    if (!films) {
      films = await this.httpClient.getAll<ExternalFilm>('films', {
        page: 1,
        limit: 1000,
      });
    }

    const openings = films.results.map((film) => film.opening_crawl);
    const wordCount: Record<string, number> = {};

    openings.forEach((opening) => {
      opening
        .split(/[\s\x00-\x1F]+/)
        .filter((word) => word)
        .forEach((word) => {
          const lowerCaseWord = word.toLowerCase();
          wordCount[lowerCaseWord] = (wordCount[lowerCaseWord] || 0) + 1;
        });
    });

    this.filmRepository.saveListOfFilmsInCache(films);

    const uniquePairs = Object.entries(wordCount);

    this.filmRepository.saveUniqueWordPairsInCache(uniquePairs);

    return uniquePairs;
  }

  async getCharacterWithMostMentions(): Promise<string[]> {
    const cachedCharacter =
      await this.filmRepository.findCharacterWithMostMentions();

    if (cachedCharacter) {
      return cachedCharacter;
    }

    const films = await this.findAll(1, 1000);

    const openings = films.results.map((film) => film.opening_crawl);

    const peopleResponse = await this.peopleService.findAll(1, 1000);
    const nameCount: Record<string, number> = {};

    peopleResponse.results.forEach((person) => {
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
    const character = Object.keys(nameCount).filter(
      (name) => nameCount[name] === maxCount,
    );
    this.filmRepository.saveCharacterWithMostMentionsInCache(character);
    return character;
  }
}
