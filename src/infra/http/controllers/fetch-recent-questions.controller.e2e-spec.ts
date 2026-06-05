import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@faker-js/faker/.';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });
  test('[GET] /api/questions', async () => {
    const userDb = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: userDb.id });

    Array.from({ length: 2 }).map(async (_, i) => {
      await questionFactory.makePrismaQuestion({
        title: `Question ${i + 1}`,
        slug: Slug.create(`question-${i + 1}`),
        content: `question ${i + 1} content`,
        authorId: userDb.id,
      });
    });

    const response = await request(app.getHttpServer())
      .get('/api/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'Question 1' }),
        expect.objectContaining({ title: 'Question 2' }),
      ],
      page: expect.any(Number),
    });
  });
});
