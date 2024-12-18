import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesListResolver } from './vehicles-list.resolver';
import { VehicleService } from '../application/vehicle.service';
import { VehiclesListDto } from '../dto/vehicles-list.dto';

describe('VehiclesListResolver', () => {
  let resolver: VehiclesListResolver;
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesListResolver,
        {
          provide: VehicleService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<VehiclesListResolver>(VehiclesListResolver);
    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getVehiclesList', () => {
    it('should return a list of vehicles', async () => {
      const result: VehiclesListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getVehiclesList(1, 10)).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('should use default values for page and limit', async () => {
      const result: VehiclesListDto = {
        count: 1,
        isNext: null,
        isPrevious: null,
        results: [],
        page: 1,
        pages: 1,
        limit: 10,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.getVehiclesList()).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
    });
  });
});
