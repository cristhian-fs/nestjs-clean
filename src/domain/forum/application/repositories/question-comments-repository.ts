import type { PaginationProps } from "@/core/repositories/pagination-props";
import type { QuestionComment } from "../../enterprise/entities/question-comment";

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>;
  create(question: QuestionComment): Promise<void>;
  delete(questionComment: QuestionComment): Promise<void>;
  findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<QuestionComment[]>;
}
