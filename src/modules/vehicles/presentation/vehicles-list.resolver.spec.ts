import { TestingModule, Test } from '@nestjs/testing';
import { VehicleService } from '../application/vehicle.service';
import { VehiclesListResolver } from './vehicles-list.resolver';
import { VehiclesListDto } from '../dto/vehicles-list.dto';

describe('VehiclesListResolver', () => {
  let resolver: VehiclesListResolver;
  let vehicleService: VehicleService;

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
    vehicleService = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return a list of vehicles', async () => {
    const result: VehiclesListDto = new VehiclesListDto();
    result.count = 0;
    result.isNext = false;
    result.isPrevious = false;
    result.results = [];
    result.page = 1;
    result.pages = 1;

    jest.spyOn(vehicleService, 'findAll').mockResolvedValue(result);

    expect(await resolver.getVehiclesList('1', '')).toEqual({
      count: 0,
      isNext: false,
      isPrevious: false,
      results: [],
      page: 1,
      pages: 1,
    });
    expect(vehicleService.findAll).toHaveBeenCalledWith(1, '');
  });
});
