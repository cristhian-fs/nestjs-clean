import { PaginationProps } from '@/core/repositories/pagination-props';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaQuestionCommentMapper } from '../prisma/mappers/prisma-question-comment-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) return null;

    return PrismaQuestionCommentMapper.toDomain(comment);
  }
  async create(question: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(question);

    await this.prisma.comment.create({
      data,
    });
  }
  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    });
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<QuestionComment[]> {
    const data = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return data.map(PrismaQuestionCommentMapper.toDomain);
  }
}
