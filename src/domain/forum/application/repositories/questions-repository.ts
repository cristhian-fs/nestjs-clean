import type { PaginationProps } from '@/core/repositories/pagination-props';
import type { Question } from '../../enterprise/entities/question';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';
import { QuestionSummary } from '../../enterprise/entities/value-objects/question-summary';

export abstract class QuestionsRepository {
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>;
  abstract create(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract findManyRecents(props: PaginationProps): Promise<Question[]>;
	abstract findManyRecentsWithAuthor(props: PaginationProps): Promise<QuestionSummary[]>;
  abstract findById(id: string): Promise<Question | null>;
  abstract delete(question: Question): Promise<void>;
}
