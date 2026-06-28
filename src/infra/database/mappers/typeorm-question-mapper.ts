import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { QuestionEntity } from '../entities/question.entity';

export class TypeORMQuestionMapper {
  static toDomain(raw: QuestionEntity): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(question: Question): QuestionEntity {
    const entity = new QuestionEntity();
    entity.id = question.id.toString();
    entity.title = question.title;
    entity.slug = question.slug.value;
    entity.content = question.content;
    entity.authorId = question.authorId.toString();
    entity.bestAnswerId = question.bestAnswerId?.toString();
    entity.createdAt = question.createdAt;
    entity.updatedAt = question.updatedAt ?? new Date();
    return entity;
  }
}
