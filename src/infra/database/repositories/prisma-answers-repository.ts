import { PaginationProps } from '@/core/repositories/pagination-props';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaAnswerMapper } from '../prisma/mappers/prisma-answer-mapper';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { DomainEvents } from '@/core/events/domain-events';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { PrismaAnswerWithAuthorMapper } from '../prisma/mappers/prisma-answer-with-author-mapper';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findManyByQuestionId(
    questionId: string,
    props: PaginationProps,
  ): Promise<Answer[]> {
    const { page } = props;

    const answers = await this.prisma.answer.findMany({
      take: 20,
      skip: (page - 1) * 20,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        questionId,
      },
    });
    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer));
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<AnswerWithAuthor[]> {
    const answers = await this.prisma.answer.findMany({
      take: 20,
      skip: (page - 1) * 20,
      include: {
        attachments: true,
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        questionId,
      },
    });
    return answers.map((answer) =>
      PrismaAnswerWithAuthorMapper.toDomain(answer),
    );
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) return null;

    return PrismaAnswerMapper.toDomain(answer);
  }
  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await Promise.all([
      this.prisma.answer.update({
        data,
        where: { id: data.id },
      }),
      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ]);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() },
    });
  }
}
