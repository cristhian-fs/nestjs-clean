import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Upload Attachment (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });
  test('[GET] /api/questions/:slug', async () => {
    const userDb = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: userDb.id.toString() });

    const response = await request(app.getHttpServer())
      .get('/api/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({ slug: 'question-01' }),
    });
  });
});
