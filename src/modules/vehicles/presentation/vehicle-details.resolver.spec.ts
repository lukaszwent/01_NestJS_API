import { ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { VehicleDetailsResolver } from './vehicle-details.resolver';
import { VehicleService } from '../application/vehicle.service';

describe('VehicleDetailsResolver (e2e)', () => {
  let app: INestApplication;
  let vehicleService: VehicleService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        VehicleDetailsResolver,
        {
          provide: VehicleService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              name: 'Test Vehicle',
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    vehicleService = moduleFixture.get<VehicleService>(VehicleService);
  });

  it('should return a vehicle', () => {
    const query = `
            query {
                getVehicle(id: "1") {
                    id
                    name
                }
            }
        `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.getVehicle.id).toBe('1');
        expect(res.body.data.getVehicle.name).toBe('Test Vehicle');
      });
  });

  it('should call VehicleService.findOne with correct id', async () => {
    const query = `
            query {
                getVehicle(id: "1") {
                    id
                    name
                }
            }
        `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(vehicleService.findOne).toHaveBeenCalledWith('1');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
