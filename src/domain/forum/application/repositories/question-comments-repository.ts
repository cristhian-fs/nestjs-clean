import type { PaginationProps } from '@/core/repositories/pagination-props';
import type { QuestionComment } from '../../enterprise/entities/question-comment';

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;
  abstract create(question: QuestionComment): Promise<void>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<QuestionComment[]>;
}
