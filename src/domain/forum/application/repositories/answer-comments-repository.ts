import type { PaginationProps } from '@/core/repositories/pagination-props';
import type { AnswerComment } from '../../enterprise/entities/answer-comment';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
  abstract findManyByAnswerId(
    questionId: string,
    props: PaginationProps,
  ): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    props: PaginationProps,
  ): Promise<CommentWithAuthor[]>;
}
