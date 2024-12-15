import { TestingModule, Test } from '@nestjs/testing';
import { VehicleRepository } from './vehicle.repository';
import { CacheModule } from '@nestjs/cache-manager';

describe('VehicleRepository', () => {
  let repository: VehicleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [VehicleRepository],
    }).compile();

    repository = module.get<VehicleRepository>(VehicleRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return an array of vehicles', async () => {
    await repository.saveListOfVehiclesInCache(
      {
        count: 0,
        isNext: false,
        isPrevious: false,
        results: [],
        page: 1,
        pages: 1,
      },
      '',
    );
    const vehicles = await repository.findAll(1, '');
    expect(vehicles.results).toBeInstanceOf(Array);
  });

  it('should return a single vehicle', async () => {
    await repository.saveVehicleInCache({
      id: '1',
      name: '',
      model: '',
      manufacturer: '',
      cost_in_credits: '',
      length: '',
      max_atmosphering_speed: '',
      crew: '',
      passengers: '',
      cargo_capacity: '',
      consumables: '',
      vehicle_class: '',
      pilots: [],
      films: [],
      created: '',
      edited: '',
      url: '',
    });
    const vehicle = await repository.findOne('1');
    expect(vehicle).toBeInstanceOf(Object);
    expect(vehicle.id).toBe('1');
  });
});
