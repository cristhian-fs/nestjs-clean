import { PaginationProps } from "@/core/repositories/pagination-props";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository.js";
import type { Question } from "@/domain/forum/enterprise/entities/question.js";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question);
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    );

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
    this.items.splice(questionIndex, 1);
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id.toString() === question.id.toString(),
    );

    this.items[questionIndex] = question;
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    return question;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecents(props: PaginationProps) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((props.page - 1) * 20, props.page * 20);

    return questions;
  }
}
