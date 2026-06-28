import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentEntity } from '../entities/comment.entity';

export class TypeORMQuestionCommentMapper {
  static toDomain(raw: CommentEntity): QuestionComment {
    if (!raw.questionId) {
      throw new Error('Invalid comment type.');
    }
    return QuestionComment.create(
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

  static toPersistence(questionComment: QuestionComment): CommentEntity {
    const entity = new CommentEntity();
    entity.id = questionComment.id.toString();
    entity.authorId = questionComment.authorId.toString();
    entity.questionId = questionComment.questionId.toString();
    entity.content = questionComment.content;
    entity.createdAt = questionComment.createdAt;
    entity.updatedAt = questionComment.updatedAt ?? new Date();

    return entity;
  }
}
