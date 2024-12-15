import { StarshipRepository } from '../infrastructure/starship.repository';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Starship } from '../entity/starship.entity';
import { StarshipDetailsDto } from '../dto/starship-details.dto';
import { StarshipsListDto } from '../dto/starships-list.dto';

@Injectable()
export class StarshipService {
  private readonly logger = new Logger(StarshipService.name);

  constructor(
    private http: HttpService,
    private starshipRepository: StarshipRepository,
  ) {}

  async findOne(id: string): Promise<StarshipDetailsDto> {
    const cachedStarship = await this.starshipRepository.findOne(id);

    if (cachedStarship) {
      return cachedStarship;
    }

    const { data: starship } = await firstValueFrom(
      this.http.get<Starship>(process.env.API_URL + '/starships/' + id).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching starship';
        }),
      ),
    );

    this.starshipRepository.saveStarshipInCache(starship);

    return starship;
  }

  async findAll(page?: number, query?: string): Promise<StarshipsListDto> {
    const cachedStarships = await this.starshipRepository.findAll(page, query);

    if (cachedStarships) {
      return cachedStarships;
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
      this.http.get(process.env.API_URL + '/starships', { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching starships';
        }),
      ),
    );

    const starshipsListDto = new StarshipsListDto();
    starshipsListDto.results = data.results;
    starshipsListDto.isNext = data.next !== null;
    starshipsListDto.isPrevious = data.previous !== null;
    starshipsListDto.count = data.count;
    starshipsListDto.page = page;
    starshipsListDto.pages = Math.ceil(data.count / 10);

    this.starshipRepository.saveListOfStarshipsInCache(data, query);

    return starshipsListDto;
  }
}
