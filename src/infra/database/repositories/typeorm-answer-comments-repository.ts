import { PaginationProps } from '@/core/repositories/pagination-props';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { TypeORMCommentWithAuthorMapper, TypeORMCommentWithAuthor } from '../mappers/typeorm-comment-with-author-mapper';
import { TypeORMAnswerCommentMapper } from '../mappers/typeorm-answer-comment-mapper';

@Injectable()
export class TypeORmAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private repo: Repository<CommentEntity>,
  ) {}
  async findManyByAnswerIdWithAuthor(
    answerId: string,
    props: PaginationProps,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = await this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.answerId = :answerId', { answerId })
      .orderBy('comment.createdAt', 'DESC')
      .take(20)
      .skip((props.page - 1) * 20)
      .getMany() as TypeORMCommentWithAuthor[];

    return answerComments.map(TypeORMCommentWithAuthorMapper.toDomain);
  }
  async findById(id: string): Promise<AnswerComment | null> {
    const data = await this.repo.findOne({
      where: { id },
    });
    if (!data) return null;

    return TypeORMAnswerCommentMapper.toDomain(data);
  }
  async create(answerComment: AnswerComment): Promise<void> {
    const data = TypeORMAnswerCommentMapper.toPersistence(answerComment);
    const comment = this.repo.create({
      answerId: data.answerId,
      authorId: data.authorId,
      content: data.content,
    });
    await this.repo.save(comment);
  }
  async delete(answerComment: AnswerComment): Promise<void> {
    await this.repo.delete({
      id: answerComment.id.toString(),
    });
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationProps,
  ): Promise<AnswerComment[]> {
    const data = await this.repo.find({
      where: { answerId },
      take: 20,
      skip: (page - 1) * 20,
      order: { createdAt: 'DESC' },
    });
    return data.map(TypeORMAnswerCommentMapper.toDomain);
  }
}
