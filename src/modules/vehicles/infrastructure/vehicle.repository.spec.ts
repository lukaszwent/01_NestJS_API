import { TestingModule, Test } from '@nestjs/testing';
import { VehicleRepository } from './vehicle.repository';
import { CacheModule } from '@nestjs/cache-manager';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';
import { ExternalVehicle } from '../interfaces/external-vehicle.interface';
import { VehicleDetailsDto } from '../dto/vehicle-details.dto';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';

describe('VehicleRepository', () => {
  let repository: VehicleRepository;
  let detailsResponse: ExternalItemResponse<ExternalVehicle>;
  let listResponse: ExternalListResponse<ExternalVehicle>;
  let vehicle: VehicleDetailsDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [VehicleRepository],
    }).compile();

    repository = module.get<VehicleRepository>(VehicleRepository);
    vehicle = new VehicleDetailsDto();
    vehicle.id = '1';
    vehicle.name = 'Speeder';
    vehicle.model = 'X-34';
    vehicle.vehicle_class = 'Repulsorcraft';
    vehicle.manufacturer = 'SoroSuub Corporation';
    vehicle.cost_in_credits = '10550';
    vehicle.length = '3.4';
    vehicle.crew = '1';
    vehicle.passengers = '1';
    vehicle.max_atmosphering_speed = '250';
    vehicle.cargo_capacity = '5';
    vehicle.consumables = '1 day';
    vehicle.films = ['A New Hope'];
    vehicle.pilots = [];
    vehicle.created = '2014-12-10T15:36:25.724000Z';
    vehicle.edited = '2014-12-20T21:30:21.661000Z';
    vehicle.url = 'https://swapi.dev/api/vehicles/1/';

    detailsResponse = {
      message: '',
      result: {
        properties: vehicle,
        description: '',
        _id: '',
        uid: '1',
        __v: 0,
      },
    };

    listResponse = {
      message: 'Success',
      results: [vehicle],
      total_records: 2,
      total_pages: 1,
      previous: null,
      next: null,
    };
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of vehicles', async () => {
    await repository.saveListOfVehiclesInCache(listResponse, 1);
    const vehicles = await repository.findAll(1);
    expect(vehicles.results).toBeInstanceOf(Array);
  });

  it('should return a single vehicle', async () => {
    await repository.saveVehicleInCache(detailsResponse);
    const vehicle = await repository.findOne('1');
    expect(vehicle).toBeInstanceOf(Object);
    expect(vehicle.result.uid).toBe('1');
  });
});
