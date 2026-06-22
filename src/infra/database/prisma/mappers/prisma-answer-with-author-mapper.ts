import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Answer as PrismaAnswer,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from 'generated/prisma/client';
import { PrismaAttachmentMapper } from './prisma-attachment-mapper';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';

type PrismaAnswerDetails = PrismaAnswer & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};
export class PrismaAnswerWithAuthorMapper {
  static toDomain(raw: PrismaAnswerDetails): AnswerWithAuthor {
    return AnswerWithAuthor.create({
      answerId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
