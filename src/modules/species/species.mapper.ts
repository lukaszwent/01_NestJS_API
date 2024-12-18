import { Injectable } from '@nestjs/common';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { SpeciesListDto } from './dto/species-list.dto';
import { SpeciesDetailsDto } from './dto/species-details.dto';
import { ExternalSpecies } from './interfaces/external-species.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class SpeciesMapper {
  mapListToDTO(
    species: ExternalListResponse<ExternalSpecies>,
    params: { limit: number; page: number },
  ): SpeciesListDto {
    const speciesDTO = new SpeciesListDto();
    speciesDTO.count = species.total_records;
    speciesDTO.isNext = !!species.next;
    speciesDTO.isPrevious = !!species.previous;
    speciesDTO.limit = params.limit;
    speciesDTO.page = params.page;
    speciesDTO.pages = species.total_pages;
    speciesDTO.results = species.results.map((item) => {
      const species = new SpeciesDetailsDto();
      species.id = item.id;
      species.name = item.name;
      species.classification = item.classification;
      species.designation = item.designation;
      species.average_height = item.average_height;
      species.average_lifespan = item.average_lifespan;
      species.hair_colors = item.hair_colors;
      species.skin_colors = item.skin_colors;
      species.eye_colors = item.eye_colors;
      species.homeworld = item.homeworld;
      species.language = item.language;
      species.people = item.people;
      species.created = item.created;
      species.edited = item.edited;
      species.url = item.url;
      return species;
    });
    return speciesDTO;
  }

  mapDetailsToDTO(
    species: ExternalItemResponse<ExternalSpecies>,
  ): SpeciesDetailsDto {
    const speciesDetails = new SpeciesDetailsDto();
    speciesDetails.id = species.result.uid;
    speciesDetails.name = species.result.properties.name;
    speciesDetails.classification = species.result.properties.classification;
    speciesDetails.designation = species.result.properties.designation;
    speciesDetails.average_height = species.result.properties.average_height;
    speciesDetails.average_lifespan =
      species.result.properties.average_lifespan;
    speciesDetails.hair_colors = species.result.properties.hair_colors;
    speciesDetails.skin_colors = species.result.properties.skin_colors;
    speciesDetails.eye_colors = species.result.properties.eye_colors;
    speciesDetails.homeworld = species.result.properties.homeworld;
    speciesDetails.language = species.result.properties.language;
    speciesDetails.people = species.result.properties.people;
    speciesDetails.created = species.result.properties.created;
    speciesDetails.edited = species.result.properties.edited;
    speciesDetails.url = species.result.properties.url;
    return speciesDetails;
  }
}
