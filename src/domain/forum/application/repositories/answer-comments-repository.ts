import type { PaginationProps } from '@/core/repositories/pagination-props';
import type { AnswerComment } from '../../enterprise/entities/answer-comment';

export abstract class AnswerCommentsRepository {
  abstract findById(id: string): Promise<AnswerComment | null>;
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
  abstract findManyByAnswerId(
    questionId: string,
    props: PaginationProps,
  ): Promise<AnswerComment[]>;
}
