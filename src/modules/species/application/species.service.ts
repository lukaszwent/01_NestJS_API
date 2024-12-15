import { SpeciesRepository } from '../infrastructure/species.repository';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { SpeciesDetailsDto } from '../dto/species-details.dto';
import { SpeciesListDto } from '../dto/species-list.dto';
import { Species } from '../entity/species.entity';

@Injectable()
export class SpeciesService {
  private readonly logger = new Logger(SpeciesService.name);

  constructor(
    private http: HttpService,
    private speciesRepository: SpeciesRepository,
  ) {}

  async findOne(id: string): Promise<SpeciesDetailsDto> {
    const cachedSpecies = await this.speciesRepository.findOne(id);

    if (cachedSpecies) {
      return cachedSpecies;
    }

    const { data: species } = await firstValueFrom(
      this.http.get<Species>(process.env.API_URL + '/species/' + id).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching species';
        }),
      ),
    );

    this.speciesRepository.saveSpeciesInCache(species);

    return species;
  }

  async findAll(page?: number, query?: string): Promise<SpeciesListDto> {
    const cachedSpecies = await this.speciesRepository.findAll(page, query);

    if (cachedSpecies) {
      return cachedSpecies;
    }

    const params = {
      page: page,
      search: query,
    };

    if (!page) {
      delete params.page;
    }

    if (!query) {
      delete params.search;
    }

    const { data } = await firstValueFrom(
      this.http.get(process.env.API_URL + '/species', { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching species';
        }),
      ),
    );

    const speciesListDto = new SpeciesListDto();
    speciesListDto.results = data.results;
    speciesListDto.isNext = data.next !== null;
    speciesListDto.isPrevious = data.previous !== null;
    speciesListDto.count = data.count;
    speciesListDto.page = page;
    speciesListDto.pages = Math.ceil(data.count / 10);

    this.speciesRepository.saveListOfSpeciesInCache(data, query);

    return speciesListDto;
  }
}
