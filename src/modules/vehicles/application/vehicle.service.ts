import { VehicleRepository } from '../infrastructure/vehicle.repository';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Vehicle } from '../entity/vehicle.entity';
import { VehicleDetailsDto } from '../dto/vehicle-details.dto';
import { VehiclesListDto } from '../dto/vehicles-list.dto';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);

  constructor(
    private http: HttpService,
    private vehicleRepository: VehicleRepository,
  ) {}

  async findOne(id: string): Promise<VehicleDetailsDto> {
    const cachedVehicle = await this.vehicleRepository.findOne(id);

    if (cachedVehicle) {
      return cachedVehicle;
    }

    const { data: vehicle } = await firstValueFrom(
      this.http.get<Vehicle>(process.env.API_URL + '/vehicles/' + id).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching vehicle';
        }),
      ),
    );

    this.vehicleRepository.saveVehicleInCache(vehicle);

    return vehicle;
  }

  async findAll(page?: number, query?: string): Promise<VehiclesListDto> {
    const cachedVehicles = await this.vehicleRepository.findAll(page, query);

    if (cachedVehicles) {
      return cachedVehicles;
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
      this.http.get(process.env.API_URL + '/vehicles', { params }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Something went wrong while fetching vehicles';
        }),
      ),
    );

    const vehiclesListDto = new VehiclesListDto();
    vehiclesListDto.results = data.results;
    vehiclesListDto.isNext = data.next !== null;
    vehiclesListDto.isPrevious = data.previous !== null;
    vehiclesListDto.count = data.count;
    vehiclesListDto.page = page;
    vehiclesListDto.pages = Math.ceil(data.count / 10);

    this.vehicleRepository.saveListOfVehiclesInCache(data, query);

    return vehiclesListDto;
  }
}
