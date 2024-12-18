import { Injectable } from '@nestjs/common';
import {} from 'src/common/interfaces/external-list-response.interface';
import { FilmsListDto } from './dto/films-list.dto';
import { FilmDetailsDto } from './dto/film-details.dto';
import { ExternalFilm } from './interfaces/external-film.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { CustomFilmsResponse } from './interfaces/custom-films-response.interface';
import { UniqueWordPairsDto } from './dto/unique-word-pairs-dto';
import { CharacterWithMostMentionsDto } from './dto/character-with-most-mentions.dto';

@Injectable()
export class FilmMapper {
  mapListToDTO(films: CustomFilmsResponse): FilmsListDto {
    const filmsDTO = new FilmsListDto();
    filmsDTO.results = films.result.map((item) => {
      const film = new FilmDetailsDto();
      film.id = item.properties.id;
      film.title = item.properties.title;
      film.episode_id = item.properties.episode_id;
      film.opening_crawl = item.properties.opening_crawl;
      film.director = item.properties.director;
      film.producer = item.properties.producer;
      film.release_date = item.properties.release_date;
      film.characters = item.properties.characters;
      film.planets = item.properties.planets;
      film.starships = item.properties.starships;
      film.vehicles = item.properties.vehicles;
      film.species = item.properties.species;
      film.created = item.properties.created;
      film.edited = item.properties.edited;
      film.url = item.properties.url;
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

  mapUniqueWordPairsToDTO(
    uniqueWordPairs: (string | number)[][],
  ): UniqueWordPairsDto {
    const uniqueWordPairsDto = new UniqueWordPairsDto();
    uniqueWordPairsDto.uniqueWordPairs = uniqueWordPairs;
    return uniqueWordPairsDto;
  }

  mapCharacterWithMostMentionsToDTO(
    character: string[],
  ): CharacterWithMostMentionsDto {
    const characterDto = new CharacterWithMostMentionsDto();
    characterDto.character = character;
    return characterDto;
  }
}
