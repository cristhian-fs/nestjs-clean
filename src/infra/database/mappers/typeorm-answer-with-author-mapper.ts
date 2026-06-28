import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { TypeORMAttachmentMapper } from './typeorm-attachment-mapper';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { AnswerEntity } from '../entities/answer.entity';
import { UserEntity } from '../entities/user.entity';
import { AttachmentEntity } from '../entities/attachment.entity';

export type TypeORMAnswerDetails = AnswerEntity & {
  author: UserEntity;
  attachments: AttachmentEntity[];
};
export class TypeORMAnswerWithAuthorMapper {
  static toDomain(raw: TypeORMAnswerDetails): AnswerWithAuthor {
    return AnswerWithAuthor.create({
      answerId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      attachments: raw.attachments.map(TypeORMAttachmentMapper.toDomain),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
