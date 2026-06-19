import { PaginationProps } from '@/core/repositories/pagination-props';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaAnswerCommentMapper } from '../prisma/mappers/prisma-answer-comment-mapper';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaCommentWithAuthorMapper } from '../prisma/mappers/prisma-comment-with-author-mapper';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}
  async findManyByAnswerIdWithAuthor(
    answerId: string,
    props: PaginationProps,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (props.page - 1) * 20,
    });

    return answerComments.map(PrismaCommentWithAuthorMapper.toDomain);
  }
  async findById(id: string): Promise<AnswerComment | null> {
    const data = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!data) return null;

    return PrismaAnswerCommentMapper.toDomain(data);
  }
  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({ data });
  }
  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: answerComment.id.toString() },
    });
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationProps,
  ): Promise<AnswerComment[]> {
    const data = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    });

    return data.map(PrismaAnswerCommentMapper.toDomain);
  }
}
