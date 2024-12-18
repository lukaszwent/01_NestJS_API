import { Injectable } from '@nestjs/common';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { VehiclesListDto } from './dto/vehicles-list.dto';
import { VehicleDetailsDto } from './dto/vehicle-details.dto';
import { ExternalVehicle } from './interfaces/external-vehicle.interface';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

@Injectable()
export class VehicleMapper {
  mapListToDTO(
    vehicles: ExternalListResponse<ExternalVehicle>,
    params: { limit: number; page: number },
  ): VehiclesListDto {
    const vehiclesDTO = new VehiclesListDto();
    vehiclesDTO.count = vehicles.total_records;
    vehiclesDTO.isNext = !!vehicles.next;
    vehiclesDTO.isPrevious = !!vehicles.previous;
    vehiclesDTO.limit = params.limit;
    vehiclesDTO.page = params.page;
    vehiclesDTO.pages = vehicles.total_pages;
    vehiclesDTO.results = vehicles.results.map((item) => {
      const vehicle = new VehicleDetailsDto();
      vehicle.id = item.id;
      vehicle.name = item.name;
      vehicle.model = item.model;
      vehicle.vehicle_class = item.vehicle_class;
      vehicle.manufacturer = item.manufacturer;
      vehicle.cost_in_credits = item.cost_in_credits;
      vehicle.length = item.length;
      vehicle.crew = item.crew;
      vehicle.passengers = item.passengers;
      vehicle.max_atmosphering_speed = item.max_atmosphering_speed;
      vehicle.cargo_capacity = item.cargo_capacity;
      vehicle.consumables = item.consumables;
      vehicle.films = item.films;
      vehicle.pilots = item.pilots;
      vehicle.created = item.created;
      vehicle.edited = item.edited;
      vehicle.url = item.url;
      return vehicle;
    });
    return vehiclesDTO;
  }

  mapDetailsToDTO(
    vehicle: ExternalItemResponse<ExternalVehicle>,
  ): VehicleDetailsDto {
    const vehicleDetails = new VehicleDetailsDto();
    vehicleDetails.id = vehicle.result.uid;
    vehicleDetails.name = vehicle.result.properties.name;
    vehicleDetails.model = vehicle.result.properties.model;
    vehicleDetails.vehicle_class = vehicle.result.properties.vehicle_class;
    vehicleDetails.manufacturer = vehicle.result.properties.manufacturer;
    vehicleDetails.cost_in_credits = vehicle.result.properties.cost_in_credits;
    vehicleDetails.length = vehicle.result.properties.length;
    vehicleDetails.crew = vehicle.result.properties.crew;
    vehicleDetails.passengers = vehicle.result.properties.passengers;
    vehicleDetails.max_atmosphering_speed =
      vehicle.result.properties.max_atmosphering_speed;
    vehicleDetails.cargo_capacity = vehicle.result.properties.cargo_capacity;
    vehicleDetails.consumables = vehicle.result.properties.consumables;
    vehicleDetails.films = vehicle.result.properties.films;
    vehicleDetails.pilots = vehicle.result.properties.pilots;
    vehicleDetails.created = vehicle.result.properties.created;
    vehicleDetails.edited = vehicle.result.properties.edited;
    vehicleDetails.url = vehicle.result.properties.url;
    return vehicleDetails;
  }
}
