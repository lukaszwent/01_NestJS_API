import { Injectable } from '@nestjs/common';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { PeopleListDto } from './dto/people-list.dto';
import { PeopleDetailsDto } from './dto/people-details.dto';
import { ExternalPeople } from './interfaces/external-people.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class PeopleMapper {
  mapListToDTO(
    people: ExternalListResponse<ExternalPeople>,
    params: { limit: number; page: number },
  ): PeopleListDto {
    const peopleDTO = new PeopleListDto();
    peopleDTO.count = people.total_records;
    peopleDTO.isNext = !!people.next;
    peopleDTO.isPrevious = !!people.previous;
    peopleDTO.limit = params.limit;
    peopleDTO.page = params.page;
    peopleDTO.pages = people.total_pages;
    peopleDTO.results = people.results.map((item) => {
      const person = new PeopleDetailsDto();
      person.id = item.id;
      person.name = item.name;
      person.height = item.height;
      person.mass = item.mass;
      person.hair_color = item.hair_color;
      person.skin_color = item.skin_color;
      person.eye_color = item.eye_color;
      person.birth_year = item.birth_year;
      person.gender = item.gender;
      person.homeworld = item.homeworld;
      person.created = item.created;
      person.edited = item.edited;
      person.url = item.url;
      return person;
    });
    return peopleDTO;
  }

  mapDetailsToDTO(
    person: ExternalItemResponse<ExternalPeople>,
  ): PeopleDetailsDto {
    const peopleDetails = new PeopleDetailsDto();
    peopleDetails.id = person.result.uid;
    peopleDetails.name = person.result.properties.name;
    peopleDetails.height = person.result.properties.height;
    peopleDetails.mass = person.result.properties.mass;
    peopleDetails.hair_color = person.result.properties.hair_color;
    peopleDetails.skin_color = person.result.properties.skin_color;
    peopleDetails.eye_color = person.result.properties.eye_color;
    peopleDetails.birth_year = person.result.properties.birth_year;
    peopleDetails.gender = person.result.properties.gender;
    peopleDetails.homeworld = person.result.properties.homeworld;
    peopleDetails.created = person.result.properties.created;
    peopleDetails.edited = person.result.properties.edited;
    peopleDetails.url = person.result.properties.url;
    return peopleDetails;
  }
}
