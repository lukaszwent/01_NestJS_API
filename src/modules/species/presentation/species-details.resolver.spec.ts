import { ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { SpeciesService } from '../application/species.service';
import { SpeciesDetailsResolver } from './species-details.resolver';

describe('SpeciesDetailsResolver (e2e)', () => {
  let app: INestApplication;
  let speciesService: SpeciesService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        SpeciesDetailsResolver,
        {
          provide: SpeciesService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              name: 'Test Species',
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    speciesService = moduleFixture.get<SpeciesService>(SpeciesService);
  });

  it('should return a species', () => {
    const query = `
            query {
                getSpecies(id: "1") {
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
        expect(res.body.data.getSpecies.id).toBe('1');
        expect(res.body.data.getSpecies.name).toBe('Test Species');
      });
  });

  it('should call SpeciesService.findOne with correct id', async () => {
    const query = `
            query {
                getSpecies(id: "1") {
                    id
                    name
                }
            }
        `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(speciesService.findOne).toHaveBeenCalledWith('1');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
