import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { VehicleRepository } from '../infrastructure/vehicle.repository';
import { VehicleMapper } from '../vehicle.mapper';
import { HttpClientService } from '../../../common/services/http-client.service';
import { VehicleDetailsDto } from '../dto/vehicle-details.dto';
import { VehiclesListDto } from '../dto/vehicles-list.dto';
import { ExternalItemResponse } from 'src/common/interfaces/external-item-response.interface';
import { ExternalVehicle } from '../interfaces/external-vehicle.interface';
import { ExternalListResponse } from 'src/common/interfaces/external-list-response.interface';

describe('VehicleService', () => {
  let service: VehicleService;
  let vehicleRepository: VehicleRepository;
  let vehicleMapper: VehicleMapper;
  let httpClient: HttpClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: VehicleRepository,
          useValue: {
            findOne: jest.fn(),
            findAll: jest.fn(),
            saveVehicleInCache: jest.fn(),
            saveListOfVehiclesInCache: jest.fn(),
          },
        },
        {
          provide: VehicleMapper,
          useValue: {
            mapDetailsToDTO: jest.fn(),
            mapListToDTO: jest.fn(),
          },
        },
        {
          provide: HttpClientService,
          useValue: {
            getOne: jest.fn(),
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehicleRepository = module.get<VehicleRepository>(VehicleRepository);
    vehicleMapper = module.get<VehicleMapper>(VehicleMapper);
    httpClient = module.get<HttpClientService>(HttpClientService);
  });

  describe('findOne', () => {
    it('should return cached vehicle details if found in cache', async () => {
      const id = '1';
      const vehicleResponse: ExternalItemResponse<ExternalVehicle> = {
        message: 'OK',
        result: {
          properties: {
            name: 'Speeder',
            model: 'X-34',
            vehicle_class: 'Repulsorcraft',
            manufacturer: 'SoroSuub Corporation',
            cost_in_credits: '10550',
            length: '3.4',
            crew: '1',
            passengers: '1',
            max_atmosphering_speed: '250',
            cargo_capacity: '5',
            consumables: '1 day',
            films: ['A New Hope'],
            pilots: [],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/vehicles/1/',
          },
          description: '',
          _id: '',
          uid: '',
          __v: 0,
        },
      };
      const vehicleDetailsDto = new VehicleDetailsDto();

      jest
        .spyOn(vehicleRepository, 'findOne')
        .mockResolvedValue(vehicleResponse);
      jest
        .spyOn(vehicleMapper, 'mapDetailsToDTO')
        .mockReturnValue(vehicleDetailsDto);

      const result = await service.findOne(id);

      expect(vehicleRepository.findOne).toHaveBeenCalledWith(id);
      expect(vehicleMapper.mapDetailsToDTO).toHaveBeenCalledWith(
        vehicleResponse,
      );
      expect(result).toBe(vehicleDetailsDto);
    });

    it('should fetch vehicle details from external API if not found in cache', async () => {
      const id = '1';
      const vehicleResponse: ExternalItemResponse<ExternalVehicle> = {
        message: 'OK',
        result: {
          properties: {
            name: 'Speeder',
            model: 'X-34',
            vehicle_class: 'Repulsorcraft',
            manufacturer: 'SoroSuub Corporation',
            cost_in_credits: '10550',
            length: '3.4',
            crew: '1',
            passengers: '1',
            max_atmosphering_speed: '250',
            cargo_capacity: '5',
            consumables: '1 day',
            films: ['A New Hope'],
            pilots: [],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/vehicles/1/',
          },
          description: '',
          _id: '',
          uid: '',
          __v: 0,
        },
      };
      const vehicleDetailsDto = new VehicleDetailsDto();

      jest.spyOn(vehicleRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(httpClient, 'getOne').mockResolvedValue(vehicleResponse);
      jest.spyOn(vehicleRepository, 'saveVehicleInCache').mockImplementation();
      jest
        .spyOn(vehicleMapper, 'mapDetailsToDTO')
        .mockReturnValue(vehicleDetailsDto);

      const result = await service.findOne(id);

      expect(vehicleRepository.findOne).toHaveBeenCalledWith(id);
      expect(httpClient.getOne).toHaveBeenCalledWith(`vehicles/${id}`);
      expect(vehicleRepository.saveVehicleInCache).toHaveBeenCalledWith(
        vehicleResponse,
      );
      expect(vehicleMapper.mapDetailsToDTO).toHaveBeenCalledWith(
        vehicleResponse,
      );
      expect(result).toBe(vehicleDetailsDto);
    });
  });

  describe('findAll', () => {
    it('should return cached vehicles list if found in cache', async () => {
      const page = 1;
      const limit = 10;
      const cachedVehicles: ExternalListResponse<ExternalVehicle> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Speeder',
            model: 'X-34',
            vehicle_class: 'Repulsorcraft',
            manufacturer: 'SoroSuub Corporation',
            cost_in_credits: '10550',
            length: '3.4',
            crew: '1',
            passengers: '1',
            max_atmosphering_speed: '250',
            cargo_capacity: '5',
            consumables: '1 day',
            films: ['A New Hope'],
            pilots: [],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/vehicles/1/',
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const vehiclesListDto = new VehiclesListDto();

      jest
        .spyOn(vehicleRepository, 'findAll')
        .mockResolvedValue(cachedVehicles);
      jest
        .spyOn(vehicleMapper, 'mapListToDTO')
        .mockReturnValue(vehiclesListDto);

      const result = await service.findAll(page, limit);

      expect(vehicleRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(vehicleMapper.mapListToDTO).toHaveBeenCalledWith(cachedVehicles, {
        limit,
        page,
      });
      expect(result).toBe(vehiclesListDto);
    });

    it('should fetch vehicles list from external API if not found in cache', async () => {
      const page = 1;
      const limit = 10;
      const vehiclesResponse: ExternalListResponse<ExternalVehicle> = {
        message: 'OK',
        results: [
          {
            id: '1',
            name: 'Speeder',
            model: 'X-34',
            vehicle_class: 'Repulsorcraft',
            manufacturer: 'SoroSuub Corporation',
            cost_in_credits: '10550',
            length: '3.4',
            crew: '1',
            passengers: '1',
            max_atmosphering_speed: '250',
            cargo_capacity: '5',
            consumables: '1 day',
            films: ['A New Hope'],
            pilots: [],
            created: '2014-12-09T13:50:49.641000Z',
            edited: '2014-12-20T20:58:18.411000Z',
            url: 'https://swapi.dev/api/vehicles/1/',
          },
        ],
        total_records: 1,
        total_pages: 1,
        previous: null,
        next: null,
      };
      const vehiclesListDto = new VehiclesListDto();

      jest.spyOn(vehicleRepository, 'findAll').mockResolvedValue(null);
      jest.spyOn(httpClient, 'getAll').mockResolvedValue(vehiclesResponse);
      jest
        .spyOn(vehicleRepository, 'saveListOfVehiclesInCache')
        .mockImplementation();
      jest
        .spyOn(vehicleMapper, 'mapListToDTO')
        .mockReturnValue(vehiclesListDto);

      const result = await service.findAll(page, limit);

      expect(vehicleRepository.findAll).toHaveBeenCalledWith(page, limit);
      expect(httpClient.getAll).toHaveBeenCalledWith('vehicles', {
        page,
        limit,
      });
      expect(vehicleRepository.saveListOfVehiclesInCache).toHaveBeenCalledWith(
        vehiclesResponse,
        page,
        limit,
      );
      expect(vehicleMapper.mapListToDTO).toHaveBeenCalledWith(
        vehiclesResponse,
        {
          limit,
          page,
        },
      );
      expect(result).toBe(vehiclesListDto);
    });
  });
});
