import type { PaginationProps } from "@/core/repositories/pagination-props.js";
import type { Question } from "../../enterprise/entities/question.js";

export interface QuestionsRepository {
  findBySlug(slug: string): Promise<Question | null>;
  create(question: Question): Promise<void>;
  save(question: Question): Promise<void>;
  findManyRecents(props: PaginationProps): Promise<Question[]>;
  findById(id: string): Promise<Question | null>;
  delete(question: Question): Promise<void>;
}
