import { ApolloDriver } from '@nestjs/apollo';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { FilmDetailsResolver } from './film-details.resolver';
import { FilmService } from '../application/film.service';

describe('FilmDetailsResolver (e2e)', () => {
  let app: INestApplication;
  let filmService: FilmService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
      providers: [
        FilmDetailsResolver,
        {
          provide: FilmService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '1',
              title: 'Test Film',
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    filmService = moduleFixture.get<FilmService>(FilmService);
  });

  it('should return a film', () => {
    const query = `
            query {
                getFilm(id: "1") {
                    id
                    title
                }
            }
        `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.getFilm.id).toBe('1');
        expect(res.body.data.getFilm.title).toBe('Test Film');
      });
  });

  it('should call FilmService.findOne with correct id', async () => {
    const query = `
            query {
                getFilm(id: "1") {
                    id
                    title
                }
            }
        `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);

    expect(filmService.findOne).toHaveBeenCalledWith('1');
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
