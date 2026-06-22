import { DomainEvents } from '@/core/events/domain-events';
import { PaginationProps } from '@/core/repositories/pagination-props';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository.js';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.js';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer);

    this.answerAttachmentsRepository.createMany(answer.attachments.getItems());

    DomainEvents.dispatchEventsForAggregate(answer.id);
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
  async save(answer: Answer) {
    const answerIndex = this.items.findIndex(
      (item) => item.id.toString() === answer.id.toString(),
    );

    this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    );

    this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    this.items[answerIndex] = answer;
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

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<AnswerWithAuthor[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((answer) => {
        const author = this.studentsRepository.items.find((item) =>
          answer.authorId.equals(item.id),
        );

        if (!author) {
          throw new Error(`Author with id "${answer.authorId}" not found`);
        }

        const answerAttachments = this.answerAttachmentsRepository.items.filter(
          (answerAttachment) => answerAttachment.answerId.equals(answer.id),
        );

        const attachments = answerAttachments.map((answerAttachment) => {
          const attachment = this.attachmentsRepository.items.find(
            (attachment) => attachment.id.equals(answerAttachment.attachmentId),
          );

          if (!attachment)
            throw new Error(
              `Attachment with ID "${answerAttachment.attachmentId.toString()}" does not exist`,
            );

          return attachment;
        });

        return AnswerWithAuthor.create({
          answerId: answer.id,
          authorId: author.id,
          author: author.name,
          content: answer.content,
          createdAt: answer.createdAt,
          attachments,
          updatedAt: answer.updatedAt,
        });
      });

    return answers;
  }
}
