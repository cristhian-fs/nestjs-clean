import { PaginationProps } from '@/core/repositories/pagination-props';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}
  async create(comment: AnswerComment) {
    this.items.push(comment);
  }

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    if (!questionComment) return null;

    return questionComment;
  }

  async delete(questionComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(itemIndex, 1);
  }

  async findManyByAnswerId(
    questionId: string,
    { page }: PaginationProps,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }
  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationProps,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        );

        if (!author) {
          throw new Error(
            `Author with id "${comment.authorId.toString()}" does not exist`,
          );
        }

        return CommentWithAuthor.create({
          authorId: comment.authorId,
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          author: author.name,
        });
      });

    return answerComments;
  }
}
