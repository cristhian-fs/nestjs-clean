import { config } from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { execSync } from 'child_process';
import { DomainEvents } from '@/core/events/domain-events';
import { envSchema } from '@/infra/env/env';
import Redis from 'ioredis';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

beforeAll(async () => {
  execSync('pnpm prisma migrate deploy');

  await redis.flushdb();

  DomainEvents.shouldRun = false;
});

beforeEach(async () => {
  await prisma.$executeRawUnsafe('DELETE FROM "notifications"');
  await prisma.$executeRawUnsafe('DELETE FROM "attachments"');
  await prisma.$executeRawUnsafe('DELETE FROM "answers"');
  await prisma.$executeRawUnsafe('DELETE FROM "comments"');
  await prisma.$executeRawUnsafe('DELETE FROM "questions"');
  await prisma.$executeRawUnsafe('DELETE FROM "users"');
});

afterAll(async () => {
  await prisma.$disconnect();
});
