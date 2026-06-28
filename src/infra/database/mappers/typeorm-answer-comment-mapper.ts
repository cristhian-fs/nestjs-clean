import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentEntity } from '../entities/comment.entity';

export class TypeORMAnswerCommentMapper {
  static toDomain(raw: CommentEntity): AnswerComment {
    if (!raw.answerId) {
      throw new Error('Invalid comment type.');
    }
    return AnswerComment.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        answerId: new UniqueEntityID(raw.answerId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(answerComment: AnswerComment): Partial<CommentEntity> {
    return {
      id: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
      answerId: answerComment.answerId.toString(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt ?? new Date(),
    };
  }
}
