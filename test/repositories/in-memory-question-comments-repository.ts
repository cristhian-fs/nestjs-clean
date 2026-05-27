import { PaginationProps } from "@/core/repositories/pagination-props";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];

  async create(comment: QuestionComment) {
    this.items.push(comment);
  }

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) return null;

    return questionComment;
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }
}
