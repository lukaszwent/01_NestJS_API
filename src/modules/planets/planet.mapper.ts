import { Injectable } from '@nestjs/common';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { PlanetsListDto } from './dto/planets-list.dto';
import { PlanetDetailsDto } from './dto/planet-details.dto';
import { ExternalPlanet } from './interfaces/external-planet.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class PlanetMapper {
  mapListToDTO(
    planets: ExternalListResponse<ExternalPlanet>,
    params: { limit: number; page: number },
  ): PlanetsListDto {
    const planetsDTO = new PlanetsListDto();
    planetsDTO.count = planets.total_records;
    planetsDTO.isNext = !!planets.next;
    planetsDTO.isPrevious = !!planets.previous;
    planetsDTO.limit = params.limit;
    planetsDTO.page = params.page;
    planetsDTO.pages = planets.total_pages;
    planetsDTO.results = planets.results.map((item) => {
      const planet = new PlanetDetailsDto();
      planet.id = item.id;
      planet.name = item.name;
      planet.rotation_period = item.rotation_period;
      planet.orbital_period = item.orbital_period;
      planet.diameter = item.diameter;
      planet.climate = item.climate;
      planet.gravity = item.gravity;
      planet.terrain = item.terrain;
      planet.surface_water = item.surface_water;
      planet.population = item.population;
      planet.created = item.created;
      planet.edited = item.edited;
      planet.url = item.url;
      return planet;
    });
    return planetsDTO;
  }

  mapDetailsToDTO(
    planet: ExternalItemResponse<ExternalPlanet>,
  ): PlanetDetailsDto {
    const planetDetails = new PlanetDetailsDto();
    planetDetails.id = planet.result.uid;
    planetDetails.name = planet.result.properties.name;
    planetDetails.rotation_period = planet.result.properties.rotation_period;
    planetDetails.orbital_period = planet.result.properties.orbital_period;
    planetDetails.diameter = planet.result.properties.diameter;
    planetDetails.climate = planet.result.properties.climate;
    planetDetails.gravity = planet.result.properties.gravity;
    planetDetails.terrain = planet.result.properties.terrain;
    planetDetails.surface_water = planet.result.properties.surface_water;
    planetDetails.population = planet.result.properties.population;
    planetDetails.created = planet.result.properties.created;
    planetDetails.edited = planet.result.properties.edited;
    planetDetails.url = planet.result.properties.url;
    return planetDetails;
  }
}
