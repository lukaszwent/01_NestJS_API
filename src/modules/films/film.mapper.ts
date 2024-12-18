import { Injectable } from '@nestjs/common';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { FilmsListDto } from './dto/films-list.dto';
import { FilmDetailsDto } from './dto/film-details.dto';
import { ExternalFilm } from './interfaces/external-film.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class FilmMapper {
  mapListToDTO(
    films: ExternalListResponse<ExternalFilm>,
    params: { limit: number; page: number },
  ): FilmsListDto {
    const filmsDTO = new FilmsListDto();
    filmsDTO.count = films.total_records;
    filmsDTO.isNext = !!films.next;
    filmsDTO.isPrevious = !!films.previous;
    filmsDTO.limit = params.limit;
    filmsDTO.page = params.page;
    filmsDTO.pages = films.total_pages;
    filmsDTO.results = films.results.map((item) => {
      const film = new FilmDetailsDto();
      film.id = item.id;
      film.title = item.title;
      film.episode_id = item.episode_id;
      film.opening_crawl = item.opening_crawl;
      film.director = item.director;
      film.producer = item.producer;
      film.release_date = item.release_date;
      film.characters = item.characters;
      film.planets = item.planets;
      film.starships = item.starships;
      film.vehicles = item.vehicles;
      film.species = item.species;
      film.created = item.created;
      film.edited = item.edited;
      film.url = item.url;
      return film;
    });
    return filmsDTO;
  }

  mapDetailsToDTO(film: ExternalItemResponse<ExternalFilm>): FilmDetailsDto {
    const filmDetails = new FilmDetailsDto();
    filmDetails.id = film.result.uid;
    filmDetails.title = film.result.properties.title;
    filmDetails.episode_id = film.result.properties.episode_id;
    filmDetails.opening_crawl = film.result.properties.opening_crawl;
    filmDetails.director = film.result.properties.director;
    filmDetails.producer = film.result.properties.producer;
    filmDetails.release_date = film.result.properties.release_date;
    filmDetails.characters = film.result.properties.characters;
    filmDetails.planets = film.result.properties.planets;
    filmDetails.starships = film.result.properties.starships;
    filmDetails.vehicles = film.result.properties.vehicles;
    filmDetails.species = film.result.properties.species;
    filmDetails.created = film.result.properties.created;
    filmDetails.edited = film.result.properties.edited;
    filmDetails.url = film.result.properties.url;
    return filmDetails;
  }
}
