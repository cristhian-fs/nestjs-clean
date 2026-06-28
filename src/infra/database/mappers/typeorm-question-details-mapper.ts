import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { TypeORMAttachmentMapper } from './typeorm-attachment-mapper';
import { QuestionEntity } from '../entities/question.entity';
import { UserEntity } from '../entities/user.entity';
import { AttachmentEntity } from '../entities/attachment.entity';

export type TypeORMQuestionDetails = QuestionEntity & {
  author: UserEntity;
  attachments: AttachmentEntity[];
};
export class TypeORMQuestionDetailsMapper {
  static toDomain(raw: TypeORMQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      title: raw.title,
      slug: Slug.create(raw.slug),
      attachments: raw.attachments.map(TypeORMAttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
