import { PaginationProps } from '@/core/repositories/pagination-props.js';
import type { Answer } from '../../enterprise/entities/answer.js';

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<Answer[]>;
  abstract findById(id: string): Promise<Answer | null>;
  abstract save(question: Answer): Promise<void>;
  abstract delete(question: Answer): Promise<void>;
}
