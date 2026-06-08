import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { AnswerFactory } from 'test/factories/make-answer';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';

describe('Fetch Answer Comments (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;
  let jwt: JwtService;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        AnswerCommentFactory,
        QuestionFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });
  test('[GET] /api/answers/:id/comments', async () => {
    const userDb = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: userDb.id });

    const question = await questionFactory.makePrismaQuestion({
      authorId: userDb.id,
    });
    const answer = await answerFactory.makePrismaAnswer({
      authorId: userDb.id,
      questionId: question.id,
    });
    await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        content: `Answer comment 01`,
        authorId: userDb.id,
        answerId: answer.id,
      }),
      answerCommentFactory.makePrismaAnswerComment({
        content: `Answer comment 02`,
        authorId: userDb.id,
        answerId: answer.id,
      }),
    ]);
    const response = await request(app.getHttpServer())
      .get(`/api/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ content: 'Answer comment 01' }),
        expect.objectContaining({ content: 'Answer comment 02' }),
      ]),
      page: expect.any(Number),
    });
  });
});
