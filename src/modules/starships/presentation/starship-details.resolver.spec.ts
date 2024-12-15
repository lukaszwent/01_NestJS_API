import { ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { StarshipDetailsResolver } from './starship-details.resolver';
import { StarshipService } from '../application/starship.service';

describe('StarshipDetailsResolver (e2e)', () => {
  let app: INestApplication;
  let starshipService: StarshipService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        StarshipDetailsResolver,
        {
          provide: StarshipService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              name: 'Test Starship',
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    starshipService = moduleFixture.get<StarshipService>(StarshipService);
  });

  it('should return a starship', () => {
    const query = `
            query {
                getStarship(id: "1") {
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
        expect(res.body.data.getStarship.id).toBe('1');
        expect(res.body.data.getStarship.name).toBe('Test Starship');
      });
  });

  it('should call StarshipService.findOne with correct id', async () => {
    const query = `
            query {
                getStarship(id: "1") {
                    id
                    name
                }
            }
        `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(starshipService.findOne).toHaveBeenCalledWith('1');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
