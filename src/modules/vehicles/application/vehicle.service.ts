import { VehicleMapper } from '../vehicle.mapper';
import { VehicleRepository } from '../infrastructure/vehicle.repository';
import { Injectable } from '@nestjs/common';
import { VehiclesListDto } from '../dto/vehicles-list.dto';
import { VehicleDetailsDto } from '../dto/vehicle-details.dto';
import { ExternalVehicle } from '../interfaces/external-vehicle.interface';
import { HttpClientService } from '../../../common/services/http-client.service';

@Injectable()
export class VehicleService {
  constructor(
    private vehicleRepository: VehicleRepository,
    private vehicleMapper: VehicleMapper,
    private httpClient: HttpClientService,
  ) {}

  async findOne(id: string): Promise<VehicleDetailsDto> {
    const cachedVehicle = await this.vehicleRepository.findOne(id);

    if (cachedVehicle) {
      return this.vehicleMapper.mapDetailsToDTO(cachedVehicle);
    }

    const vehicle = await this.httpClient.getOne<ExternalVehicle>(
      `vehicles/${id}`,
    );

    this.vehicleRepository.saveVehicleInCache(vehicle);

    return this.vehicleMapper.mapDetailsToDTO(vehicle);
  }

  async findAll(page: number, limit: number): Promise<VehiclesListDto> {
    const cachedVehicles = await this.vehicleRepository.findAll(page, limit);

    if (cachedVehicles) {
      return this.vehicleMapper.mapListToDTO(cachedVehicles, { limit, page });
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

    const vehicles = await this.httpClient.getAll<ExternalVehicle>(
      'vehicles',
      params,
    );

    const vehiclesListDto = this.vehicleMapper.mapListToDTO(vehicles, {
      limit,
      page,
    });

    this.vehicleRepository.saveListOfVehiclesInCache(vehicles, page, limit);

    return vehiclesListDto;
  }
}
