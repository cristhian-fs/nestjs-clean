import { PaginationProps } from '@/core/repositories/pagination-props';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { DomainEvents } from '@/core/events/domain-events';
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/answer-with-author';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from '../entities/answer.entity';
import { Repository } from 'typeorm';
import { TypeORMAnswerMapper } from '../mappers/typeorm-answer-mapper';
import {
  TypeORMAnswerDetails,
  TypeORMAnswerWithAuthorMapper,
} from '../mappers/typeorm-answer-with-author-mapper';

@Injectable()
export class TypeORMAnswersRepository implements AnswersRepository {
  constructor(
    @InjectRepository(AnswerEntity)
    private answersRepo: Repository<AnswerEntity>,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = TypeORMAnswerMapper.toPersistence(answer);

    await this.answersRepo.save(this.answersRepo.create(data));

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

    const answers = await this.answersRepo
      .createQueryBuilder('answer')
      .where('answer.answerId = :answerId', { questionId })
      .orderBy('answer.createdAt', 'DESC')
      .take(20)
      .skip((page - 1) * 20)
      .getMany();
    return answers.map((answer) => TypeORMAnswerMapper.toDomain(answer));
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<AnswerWithAuthor[]> {
    const answers = (await this.answersRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.attachments', 'attachments')
      .where('comment.answerId = :answerId', { questionId })
      .orderBy('comment.createdAt', 'DESC')
      .take(20)
      .skip((page - 1) * 20)
      .getRawMany()) as unknown as TypeORMAnswerDetails[];

    return answers.map((answer) =>
      TypeORMAnswerWithAuthorMapper.toDomain(answer),
    );
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.answersRepo.findOne({
      where: {
        id,
      },
    });

    if (!answer) return null;

    return TypeORMAnswerMapper.toDomain(answer);
  }
  async save(answer: Answer): Promise<void> {
    const data = TypeORMAnswerMapper.toPersistence(answer);

    await Promise.all([
      this.answersRepo.update(
        {
          id: data.id,
        },
        data,
      ),
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
    await this.answersRepo.delete({
      id: answer.id.toString(),
    });
  }
}
