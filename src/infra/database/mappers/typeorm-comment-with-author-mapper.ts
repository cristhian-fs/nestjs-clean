import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { CommentEntity } from '../entities/comment.entity';
import { UserEntity } from '../entities/user.entity';

export type TypeORMCommentWithAuthor = CommentEntity & {
  author: UserEntity;
};
export class TypeORMCommentWithAuthorMapper {
  static toDomain(raw: TypeORMCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      author: raw.author.name,
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
