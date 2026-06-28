import { PaginationProps } from '@/core/repositories/pagination-props';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Repository } from 'typeorm';
import { TypeORMCommentWithAuthorMapper, TypeORMCommentWithAuthor } from '../mappers/typeorm-comment-with-author-mapper';
import { TypeORMQuestionCommentMapper } from '../mappers/typeorm-question-comment-mapper';

@Injectable()
export class TypeORMQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepo: Repository<CommentEntity>,
  ) {}

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    props: PaginationProps,
  ): Promise<CommentWithAuthor[]> {
    const questionComments = await this.commentsRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .where('comment.questionId = :questionId', { questionId })
      .orderBy('comment.createdAt', 'DESC')
      .take(20)
      .skip((props.page - 1) * 20)
      .getMany() as TypeORMCommentWithAuthor[];

    return questionComments.map(TypeORMCommentWithAuthorMapper.toDomain);
  }
  async findById(id: string): Promise<QuestionComment | null> {
    const comment = await this.commentsRepo.findOne({
      where: {
        id,
      },
    });

    if (!comment) return null;

    return TypeORMQuestionCommentMapper.toDomain(comment);
  }
  async create(question: QuestionComment): Promise<void> {
    const data = TypeORMQuestionCommentMapper.toPersistence(question);

    await this.commentsRepo.save(this.commentsRepo.create(data));
  }
  async delete(questionComment: QuestionComment): Promise<void> {
    await this.commentsRepo.delete({
      id: questionComment.id.toString(),
    });
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<QuestionComment[]> {
    const questionComments = await this.commentsRepo
      .createQueryBuilder('comment')
      .where('comment.questionId = :questionId', { questionId })
      .orderBy('comment.createdAt', 'DESC')
      .take(20)
      .skip((page - 1) * 20)
      .getMany();

    return questionComments.map(TypeORMQuestionCommentMapper.toDomain);
  }
}
