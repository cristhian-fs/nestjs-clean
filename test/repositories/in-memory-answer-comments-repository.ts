import { PaginationProps } from "@/core/repositories/pagination-props";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  async create(comment: AnswerComment) {
    this.items.push(comment);
  }

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) return null;

    return questionComment;
  }

  async delete(questionComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }
}
