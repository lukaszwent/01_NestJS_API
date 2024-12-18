import { TestingModule, Test } from '@nestjs/testing';
import { SpeciesRepository } from './species.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalSpecies } from '../interfaces/external-species.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { SpeciesDetailsDto } from '../dto/species-details.dto';

describe('SpeciesRepository', () => {
  let repository: SpeciesRepository;
  let detailsResponse: ExternalItemResponse<ExternalSpecies>;
  let listResponse: ExternalListResponse<ExternalSpecies>;
  let species: SpeciesDetailsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [SpeciesRepository],
    }).compile();

    repository = module.get<SpeciesRepository>(SpeciesRepository);
    species = new SpeciesDetailsDto();
    species.id = '1';
    species.name = 'Human';
    species.classification = 'Mammal';
    species.designation = 'Sentient';
    species.average_height = '180';
    species.average_lifespan = '80';
    species.hair_colors = 'varied';
    species.skin_colors = 'varied';
    species.eye_colors = 'varied';
    species.homeworld = 'Earth';
    species.language = 'varied';

    detailsResponse = {
      message: '',
      result: {
        properties: species,
        description: '',
        _id: '',
        uid: '1',
        __v: 0,
      },
    };

    listResponse = {
      message: 'Success',
      results: [species],
      total_records: 2,
      total_pages: 1,
      previous: null,
      next: null,
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of species', async () => {
    await repository.saveListOfSpeciesInCache(listResponse, 1);
    const species = await repository.findAll(1);
    expect(species.results).toBeInstanceOf(Array);
  });

  it('should return a single species', async () => {
    await repository.saveSpeciesInCache(detailsResponse);
    const species = await repository.findOne('1');
    expect(species).toBeInstanceOf(Object);
    expect(species.result.uid).toBe('1');
  });
});
