import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
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
  test('[POST] /api/questions', async () => {
    const user = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const userDb = await prisma.user.create({ data: user });

    const accessToken = jwt.sign({ sub: userDb.id });

    const response = await request(app.getHttpServer())
      .post('/api/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Question',
        content: 'Question content',
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New Question',
      },
    });

    expect(questionOnDatabase).toBeTruthy();
  });
});
