import { TestingModule, Test } from '@nestjs/testing';
import { PeopleRepository } from './people.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalPeople } from '../interfaces/external-people.interface';
import { PeopleDetailsDto } from '../dto/people-details.dto';

describe('PeopleRepository', () => {
  let repository: PeopleRepository;
  let listResponse: ExternalListResponse<ExternalPeople>;
  let person: PeopleDetailsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [PeopleRepository],
    }).compile();

    repository = module.get<PeopleRepository>(PeopleRepository);
    person = new PeopleDetailsDto();
    person.id = '1';
    person.name = 'Luke Skywalker';
    person.height = '172';
    person.mass = '77';
    person.hair_color = 'blond';
    person.skin_color = 'fair';
    person.eye_color = 'blue';
    person.birth_year = '19BBY';
    person.gender = 'male';
    person.homeworld = 'Tatooine';

    listResponse = {
      message: 'Success',
      results: [person],
      total_records: 2,
      total_pages: 1,
      previous: null,
      next: null,
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of people', async () => {
    await repository.saveListOfPeopleInCache(listResponse, 1);
    const people = await repository.findAll(1);
    expect(people.results).toBeInstanceOf(Array);
  });
});
