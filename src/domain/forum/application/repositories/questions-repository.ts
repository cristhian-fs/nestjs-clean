import type { PaginationProps } from '@/core/repositories/pagination-props';
import type { Question } from '../../enterprise/entities/question';

export abstract class QuestionsRepository {
  abstract findBySlug(slug: string): Promise<Question | null>;
  abstract create(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract findManyRecents(props: PaginationProps): Promise<Question[]>;
  abstract findById(id: string): Promise<Question | null>;
  abstract delete(question: Question): Promise<void>;
}
