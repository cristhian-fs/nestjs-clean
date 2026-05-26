import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { execSync } from 'child_process';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

beforeAll(async () => {
  execSync('pnpm prisma migrate deploy');
});

beforeEach(async () => {
  await prisma.$executeRawUnsafe('DELETE FROM "questions"');
  await prisma.$executeRawUnsafe('DELETE FROM "users"');
});

afterAll(async () => {
  await prisma.$disconnect();
});
