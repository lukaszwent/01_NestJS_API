import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalVehicle } from '../interfaces/external-vehicle.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class VehicleRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveListOfVehiclesInCache(
    vehicles: ExternalListResponse<ExternalVehicle>,
    page?: number,
    limit?: number,
  ): Promise<void> {
    if (page || limit) {
      await this.cacheManager.set(
        `vehicles:${page}:${limit}`,
        JSON.stringify(vehicles),
      );
    } else {
      await this.cacheManager.set(`vehicles`, JSON.stringify(vehicles));
    }
  }

  async saveVehicleInCache(vehicle: ExternalItemResponse<ExternalVehicle>) {
    await this.cacheManager.set(
      `vehicle:${vehicle.result.uid}`,
      JSON.stringify(vehicle),
    );
  }

  async findOne(id: string): Promise<ExternalItemResponse<ExternalVehicle>> {
    const vehicle = await this.cacheManager.get(`vehicle:${id}`);

    return vehicle ? JSON.parse(vehicle as string) : null;
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<ExternalListResponse<ExternalVehicle>> {
    let vehicles;
    if (page || limit) {
      vehicles = await this.cacheManager.get(`vehicles:${page}:${limit}`);
    } else {
      vehicles = await this.cacheManager.get(`vehicles`);
    }

    return vehicles ? JSON.parse(vehicles as string) : null;
  }
}
