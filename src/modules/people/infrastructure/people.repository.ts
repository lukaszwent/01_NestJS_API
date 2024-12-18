import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalPeople } from '../interfaces/external-people.interface';

@Injectable()
export class PeopleRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfPeopleInCache(
    people: ExternalListResponse<ExternalPeople>,
    page?: number,
    limit?: number,
  ): Promise<void> {
    if (page || limit) {
      await this.cacheManager.set(
        `people:${page}:${limit}`,
        JSON.stringify(people),
      );
    } else {
      await this.cacheManager.set(`people`, JSON.stringify(people));
    }
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<ExternalListResponse<ExternalPeople>> {
    let people;
    if (page || limit) {
      people = await this.cacheManager.get(`people:${page}:${limit}`);
    } else {
      people = await this.cacheManager.get(`people`);
    }

    return people ? JSON.parse(people as string) : null;
  }
}
