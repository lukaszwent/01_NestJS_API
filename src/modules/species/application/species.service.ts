import { SpeciesMapper } from '../species.mapper';
import { SpeciesRepository } from '../infrastructure/species.repository';
import { Injectable } from '@nestjs/common';
import { SpeciesListDto } from '../dto/species-list.dto';
import { SpeciesDetailsDto } from '../dto/species-details.dto';
import { ExternalSpecies } from '../interfaces/external-species.interface';
import { HttpClientService } from '../../../common/services/http-client.service';

@Injectable()
export class SpeciesService {
  constructor(
    private speciesRepository: SpeciesRepository,
    private speciesMapper: SpeciesMapper,
    private httpClient: HttpClientService,
  ) {}

  async findOne(id: string): Promise<SpeciesDetailsDto> {
    const cachedSpecies = await this.speciesRepository.findOne(id);

    if (cachedSpecies) {
      return this.speciesMapper.mapDetailsToDTO(cachedSpecies);
    }

    const species = await this.httpClient.getOne<ExternalSpecies>(
      `species/${id}`,
    );

    this.speciesRepository.saveSpeciesInCache(species);

    return this.speciesMapper.mapDetailsToDTO(species);
  }

  async findAll(page: number, limit: number): Promise<SpeciesListDto> {
    const cachedSpecies = await this.speciesRepository.findAll(page, limit);

    if (cachedSpecies) {
      return this.speciesMapper.mapListToDTO(cachedSpecies, { limit, page });
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

    const species = await this.httpClient.getAll<ExternalSpecies>(
      'species',
      params,
    );

    const speciesListDto = this.speciesMapper.mapListToDTO(species, {
      limit,
      page,
    });

    this.speciesRepository.saveListOfSpeciesInCache(species, page, limit);

    return speciesListDto;
  }
}
