import { PaginationProps } from "@/core/repositories/pagination-props.js";
import type { Answer } from "../../enterprise/entities/answer.js";

export interface AnswersRepository {
  create(answer: Answer): Promise<void>;
  findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<Answer[]>;
  findById(id: string): Promise<Answer | null>;
  save(question: Answer): Promise<Answer>;
  delete(question: Answer): Promise<void>;
}
