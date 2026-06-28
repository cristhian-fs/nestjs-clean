import { PaginationProps } from '@/core/repositories/pagination-props';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { DomainEvents } from '@/core/events/domain-events';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { QuestionSummary } from '@/domain/forum/enterprise/entities/value-objects/question-summary';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionEntity } from '../entities/question.entity';
import { Repository } from 'typeorm';
import { TypeORMQuestionMapper } from '../mappers/typeorm-question-mapper';
import {
  TypeORMQuestionSummary,
  TypeORMQuestionSummaryMapper,
} from '../mappers/typeorm-question-summary-mapper';
import {
  TypeORMQuestionDetails,
  TypeORMQuestionDetailsMapper,
} from '../mappers/typeorm-question-details-mapper';

@Injectable()
export class TypeORMQuestionsRepository implements QuestionsRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionsRepo: Repository<QuestionEntity>,
    private cache: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.questionsRepo.findOne({
      where: {
        slug,
      },
    });

    if (!question) return null;

    return TypeORMQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);

      return cachedData;
    }

    const question = (await this.questionsRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      .leftJoinAndSelect('question.attachments', 'attachments')
      .where('question.slug = :slug', { slug })
      .getRawOne()) as unknown as TypeORMQuestionDetails;

    if (!question) return null;

    const questionDetails = TypeORMQuestionDetailsMapper.toDomain(question);
    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    );

    return questionDetails;
  }

  async create(question: Question): Promise<void> {
    const data = TypeORMQuestionMapper.toPersistence(question);

    await this.questionsRepo.save(this.questionsRepo.create(data));

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
  async save(question: Question): Promise<void> {
    const data = TypeORMQuestionMapper.toPersistence(question);

    await Promise.all([
      this.questionsRepo.update(
        {
          id: data.id.toString(),
        },
        data,
      ),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      this.cache.delete(`question:${data.slug}:details`),
    ]);
    DomainEvents.dispatchEventsForAggregate(question.id);
  }
  async findManyRecents({ page }: PaginationProps): Promise<Question[]> {
    const questions = await this.questionsRepo.find({
      take: 20,
      skip: (page - 1) * 20,
      order: {
        createdAt: 'desc',
      },
    });
    return questions.map((question) =>
      TypeORMQuestionMapper.toDomain(question),
    );
  }
  async findManyRecentsWithAuthor({
    page,
  }: PaginationProps): Promise<QuestionSummary[]> {
    const questions = (await this.questionsRepo
      .createQueryBuilder('question')
      .leftJoinAndSelect('question.author', 'author')
      .orderBy('question.createdAt', 'DESC')
      .take(20)
      .skip((page - 1) * 20)
      .getRawMany()) as unknown as TypeORMQuestionSummary[];
    return questions.map((question) =>
      TypeORMQuestionSummaryMapper.toDomain(question),
    );
  }
  async findById(id: string): Promise<Question | null> {
    const question = await this.questionsRepo.findOne({
      where: {
        id,
      },
    });

    if (!question) return null;

    return TypeORMQuestionMapper.toDomain(question);
  }
  async delete(question: Question): Promise<void> {
    const data = TypeORMQuestionMapper.toPersistence(question);

    await this.questionsRepo.delete({
      id: data.id,
    });
  }
}
