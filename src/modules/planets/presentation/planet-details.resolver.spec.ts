import { ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { PlanetDetailsResolver } from './planet-details.resolver';
import { PlanetService } from '../application/planet.service';

describe('PlanetDetailsResolver (e2e)', () => {
  let app: INestApplication;
  let planetService: PlanetService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        PlanetDetailsResolver,
        {
          provide: PlanetService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              name: 'Test Planet',
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    planetService = moduleFixture.get<PlanetService>(PlanetService);
  });

  it('should return a planet', () => {
    const query = `
            query {
                getPlanet(id: "1") {
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
        expect(res.body.data.getPlanet.id).toBe('1');
        expect(res.body.data.getPlanet.name).toBe('Test Planet');
      });
  });

  it('should call PlanetService.findOne with correct id', async () => {
    const query = `
            query {
                getPlanet(id: "1") {
                    id
                    name
                }
            }
        `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(planetService.findOne).toHaveBeenCalledWith('1');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
