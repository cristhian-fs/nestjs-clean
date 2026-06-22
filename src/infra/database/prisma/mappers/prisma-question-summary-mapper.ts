import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionSummary } from '@/domain/forum/enterprise/entities/value-objects/question-summary';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import {
  Question as PrismaQuestion,
  User as PrismaUser,
} from 'generated/prisma/client';

type PrismaQuestionSummary = PrismaQuestion & {
  author: PrismaUser;
};

export class PrismaQuestionSummaryMapper {
  static toDomain(raw: PrismaQuestionSummary): QuestionSummary {
    return QuestionSummary.create({
      questionId: new UniqueEntityID(raw.id),
      title: raw.title,
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      excerpt: raw.content.substring(0, 120).concat('...'),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      slug: Slug.create(raw.slug),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
