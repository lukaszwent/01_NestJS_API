import { StarshipMapper } from '../starship.mapper';
import { StarshipRepository } from '../infrastructure/starship.repository';
import { Injectable } from '@nestjs/common';
import { StarshipsListDto } from '../dto/starships-list.dto';
import { StarshipDetailsDto } from '../dto/starship-details.dto';
import { ExternalStarship } from '../interfaces/external-starship.interface';
import { HttpClientService } from '../../../common/services/http-client.service';

@Injectable()
export class StarshipService {
  constructor(
    private starshipRepository: StarshipRepository,
    private starshipMapper: StarshipMapper,
    private httpClient: HttpClientService,
  ) {}

  async findOne(id: string): Promise<StarshipDetailsDto> {
    const cachedStarship = await this.starshipRepository.findOne(id);

    if (cachedStarship) {
      return this.starshipMapper.mapDetailsToDTO(cachedStarship);
    }

    const starship = await this.httpClient.getOne<ExternalStarship>(
      `starships/${id}`,
    );

    this.starshipRepository.saveStarshipInCache(starship);

    return this.starshipMapper.mapDetailsToDTO(starship);
  }

  async findAll(page: number, limit: number): Promise<StarshipsListDto> {
    const cachedStarships = await this.starshipRepository.findAll(page, limit);

    if (cachedStarships) {
      return this.starshipMapper.mapListToDTO(cachedStarships, { limit, page });
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

    const starships = await this.httpClient.getAll<ExternalStarship>(
      'starships',
      params,
    );

    const starshipsListDto = this.starshipMapper.mapListToDTO(starships, {
      limit,
      page,
    });

    this.starshipRepository.saveListOfStarshipsInCache(starships, page, limit);

    return starshipsListDto;
  }
}
