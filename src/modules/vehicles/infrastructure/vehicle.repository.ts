import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../entity/vehicle.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { VehiclesListDto } from '../dto/vehicles-list.dto';

@Injectable()
export class VehicleRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfVehiclesInCache(
    vehiclesListDto: VehiclesListDto,
    query: string,
  ): Promise<void> {
    await this.cacheManager.set(
      `vehicles:${vehiclesListDto.page}:${query}`,
      JSON.stringify(vehiclesListDto),
    );
  }

  async saveVehicleInCache(vehicle: Vehicle) {
    await this.cacheManager.set(
      `vehicle:${vehicle.id}`,
      JSON.stringify(vehicle),
    );
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.cacheManager.get(`vehicle:${id}`);

    return vehicle ? JSON.parse(vehicle as string) : null;
  }

  async findAll(page: number, query: string): Promise<VehiclesListDto> {
    const vehicles = await this.cacheManager.get(`vehicles:${page}:${query}`);

    return vehicles ? JSON.parse(vehicles as string) : null;
  }
}
