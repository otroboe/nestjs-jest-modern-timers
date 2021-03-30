import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { CoreModule } from '../../src/core/core.module';

describe('Cats', () => {
  const catsService = { findAll: () => ['test'] };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CatsModule, CoreModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: catsService.findAll(),
    });
  });

  it(`/GET cats with modern timers ON`, async () => {
    jest.useFakeTimers('modern');

    await request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: catsService.findAll(),
    });

    jest.useRealTimers();
  });

  afterAll(async () => {
    await app.close();
  });
});
