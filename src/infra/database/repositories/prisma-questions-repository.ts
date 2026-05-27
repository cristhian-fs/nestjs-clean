import { PaginationProps } from '@/core/repositories/pagination-props';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaQuestionMapper } from '../prisma/mappers/prisma-question-mapper';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
			where: {
				slug
			}
		});

		if (!question) return null

		return PrismaQuestionMapper.toDomain(question)
  }
  create(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findManyRecents(props: PaginationProps): Promise<Question[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Question | null> {
    throw new Error('Method not implemented.');
  }
  delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
