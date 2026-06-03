import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create question (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });
  test('[GET] /api/questions', async () => {
    const user = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const userDb = await prisma.user.create({ data: user });

    const accessToken = jwt.sign({ sub: userDb.id });

    await prisma.question.createMany({
      data: Array.from({ length: 2 }).map((_, i) => ({
        title: `Question ${i + 1}`,
        slug: `question-${i + 1}`,
        content: `question ${i + 1} content`,
        authorId: userDb.id,
      })),
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
