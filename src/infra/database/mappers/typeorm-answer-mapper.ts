import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerEntity } from '../entities/answer.entity';

export class TypeORMAnswerMapper {
  static toDomain(raw: AnswerEntity): Answer {
    return Answer.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(answer: Answer): AnswerEntity {
    const entity = new AnswerEntity();
    entity.id = answer.id.toString();
    entity.authorId = answer.authorId.toString();
    entity.questionId = answer.questionId.toString();
    entity.content = answer.content;
    entity.createdAt = answer.createdAt;
    entity.updatedAt = answer.updatedAt ?? new Date();

    return entity;
  }
}
