import { PeopleMapper } from './../people.mapper';
import { PeopleRepository } from '../infrastructure/people.repository';
import { Injectable } from '@nestjs/common';
import { PeopleListDto } from '../dto/people-list.dto';
import { ExternalPeople } from '../interfaces/external-people.interface';
import { HttpClientService } from '../../../common/services/http-client.service';

@Injectable()
export class PeopleService {
  constructor(
    private peopleRepository: PeopleRepository,
    private peopleMapper: PeopleMapper,
    private httpClient: HttpClientService,
  ) {}

  async findAll(page: number, limit: number): Promise<PeopleListDto> {
    const cachedPeople = await this.peopleRepository.findAll(page, limit);

    if (cachedPeople) {
      return this.peopleMapper.mapListToDTO(cachedPeople, { limit, page });
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

    const people = await this.httpClient.getAll<ExternalPeople>(
      'people',
      params,
    );

    const peopleListDto = this.peopleMapper.mapListToDTO(people, {
      limit,
      page,
    });

    this.peopleRepository.saveListOfPeopleInCache(people, page, limit);

    return peopleListDto;
  }
}
