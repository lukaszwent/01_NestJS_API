import { Injectable } from '@nestjs/common';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { StarshipsListDto } from './dto/starships-list.dto';
import { StarshipDetailsDto } from './dto/starship-details.dto';
import { ExternalStarship } from './interfaces/external-starship.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class StarshipMapper {
  mapListToDTO(
    starships: ExternalListResponse<ExternalStarship>,
    params: { limit: number; page: number },
  ): StarshipsListDto {
    const starshipsDTO = new StarshipsListDto();
    starshipsDTO.count = starships.total_records;
    starshipsDTO.isNext = !!starships.next;
    starshipsDTO.isPrevious = !!starships.previous;
    starshipsDTO.limit = params.limit;
    starshipsDTO.page = params.page;
    starshipsDTO.pages = starships.total_pages;
    starshipsDTO.results = starships.results.map((item) => {
      const starship = new StarshipDetailsDto();
      starship.id = item.id;
      starship.name = item.name;
      starship.model = item.model;
      starship.starship_class = item.starship_class;
      starship.manufacturer = item.manufacturer;
      starship.cost_in_credits = item.cost_in_credits;
      starship.length = item.length;
      starship.crew = item.crew;
      starship.passengers = item.passengers;
      starship.max_atmosphering_speed = item.max_atmosphering_speed;
      starship.hyperdrive_rating = item.hyperdrive_rating;
      starship.MGLT = item.MGLT;
      starship.cargo_capacity = item.cargo_capacity;
      starship.consumables = item.consumables;
      starship.pilots = item.pilots;
      starship.created = item.created;
      starship.edited = item.edited;
      starship.url = item.url;
      return starship;
    });
    return starshipsDTO;
  }

  mapDetailsToDTO(
    starship: ExternalItemResponse<ExternalStarship>,
  ): StarshipDetailsDto {
    const starshipDetails = new StarshipDetailsDto();
    starshipDetails.id = starship.result.uid;
    starshipDetails.name = starship.result.properties.name;
    starshipDetails.model = starship.result.properties.model;
    starshipDetails.starship_class = starship.result.properties.starship_class;
    starshipDetails.manufacturer = starship.result.properties.manufacturer;
    starshipDetails.cost_in_credits =
      starship.result.properties.cost_in_credits;
    starshipDetails.length = starship.result.properties.length;
    starshipDetails.crew = starship.result.properties.crew;
    starshipDetails.passengers = starship.result.properties.passengers;
    starshipDetails.max_atmosphering_speed =
      starship.result.properties.max_atmosphering_speed;
    starshipDetails.hyperdrive_rating =
      starship.result.properties.hyperdrive_rating;
    starshipDetails.MGLT = starship.result.properties.MGLT;
    starshipDetails.cargo_capacity = starship.result.properties.cargo_capacity;
    starshipDetails.consumables = starship.result.properties.consumables;
    starshipDetails.pilots = starship.result.properties.pilots;
    starshipDetails.created = starship.result.properties.created;
    starshipDetails.edited = starship.result.properties.edited;
    starshipDetails.url = starship.result.properties.url;
    return starshipDetails;
  }
}
