import type { PaginationProps } from "@/core/repositories/pagination-props";
import type { AnswerComment } from "../../enterprise/entities/answer-comment";

export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>;
  create(answerComment: AnswerComment): Promise<void>;
  delete(answerComment: AnswerComment): Promise<void>;
  findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<AnswerComment[]>;
}
