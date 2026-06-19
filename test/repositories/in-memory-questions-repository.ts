import { DomainEvents } from '@/core/events/domain-events';
import { PaginationProps } from '@/core/repositories/pagination-props';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository.js';
import { Question } from '@/domain/forum/enterprise/entities/question.js';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { InMemoryStudentsRepository } from './in-memory-students-repository';
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question);

    this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );
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

    this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    );

    this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    this.items[questionIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    return question;
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) return null;

    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    );

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toString()}" does not exist`,
      );
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => questionAttachment.questionId.equals(question.id),
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) =>
        attachment.id.equals(questionAttachment.attachmentId),
      );

      if (!attachment) {
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} does not exist`,
        );
      }
      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
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
