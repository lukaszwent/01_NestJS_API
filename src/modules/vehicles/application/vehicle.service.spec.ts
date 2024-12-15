import { HttpService } from '@nestjs/axios';
import { TestingModule, Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { VehicleDetailsDto } from '../dto/vehicle-details.dto';
import { Vehicle } from '../entity/vehicle.entity';
import { VehicleRepository } from '../infrastructure/vehicle.repository';
import { VehicleService } from './vehicle.service';
import { VehiclesListDto } from '../dto/vehicles-list.dto';
import { SWVehiclesResponse } from '../interfaces/sw-vehicle-response.interface';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpService: HttpService;
  let vehicleRepository: VehicleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: VehicleRepository,
          useValue: {
            findOne: jest.fn(),
            saveVehicleInCache: jest.fn(),
            findAll: jest.fn(),
            saveListOfVehiclesInCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    httpService = module.get<HttpService>(HttpService);
    vehicleRepository = module.get<VehicleRepository>(VehicleRepository);
  });

  it('should return cached vehicle if found', async () => {
    const id = '1';
    const cachedVehicle = new VehicleDetailsDto();
    jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(cachedVehicle);

    const result = await service.findOne(id);

    expect(result).toBe(cachedVehicle);
    expect(vehicleRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch vehicle from API if not cached', async () => {
    const id = '1';
    const vehicle = new Vehicle();
    const response: AxiosResponse<Vehicle> = {
      data: vehicle,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest.spyOn(vehicleRepository, 'saveVehicleInCache').mockResolvedValue();

    const result = await service.findOne(id);

    expect(result).toBe(vehicle);
    expect(vehicleRepository.findOne).toHaveBeenCalledWith(id);
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/vehicles/${id}`,
    );
    expect(vehicleRepository.saveVehicleInCache).toHaveBeenCalledWith(vehicle);
  });

  it('should return cached vehicles if found', async () => {
    const page = 1;
    const cachedVehicles = new VehiclesListDto();
    jest.spyOn(vehicleRepository, 'findAll').mockResolvedValue(cachedVehicles);

    const result = await service.findAll(page, '');

    expect(result).toBe(cachedVehicles);
    expect(vehicleRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).not.toHaveBeenCalled();
  });

  it('should fetch vehicles from API if not cached', async () => {
    const page = 1;
    const vehicles = [new Vehicle()];
    const response: AxiosResponse<SWVehiclesResponse> = {
      data: { results: vehicles, count: 1, next: null, previous: null },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: undefined,
      },
    };
    jest.spyOn(vehicleRepository, 'findAll').mockResolvedValue(null);
    jest.spyOn(httpService, 'get').mockReturnValue(of(response));
    jest
      .spyOn(vehicleRepository, 'saveListOfVehiclesInCache')
      .mockResolvedValue();

    const result = await service.findAll(page, '');

    expect(result.results).toBe(vehicles);
    expect(vehicleRepository.findAll).toHaveBeenCalledWith(page, '');
    expect(httpService.get).toHaveBeenCalledWith(
      `${process.env.API_URL}/vehicles`,
      {
        params: { page },
      },
    );
    expect(vehicleRepository.saveListOfVehiclesInCache).toHaveBeenCalledWith(
      response.data,
      '',
    );
  });
});
