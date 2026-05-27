import { PaginationProps } from "@/core/repositories/pagination-props";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository.js";
import type { Answer } from "@/domain/forum/enterprise/entities/answer.js";

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer);
  }

  async delete(answer: Answer) {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    );

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
    this.items.splice(answerIndex, 1);
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }
  async save(question: Answer) {
    const questionIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    );

    this.items[questionIndex] = question;

    return question;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }
}
