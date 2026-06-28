import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { AttachmentEntity } from '../entities/attachment.entity';

export class TypeORMAnswerAttachmentMapper {
  static toDomain(raw: AttachmentEntity): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.');
    }
    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }
  static toPersistence(
    attachment: AnswerAttachment,
  ): Partial<AttachmentEntity> {
    return {
      id: attachment.attachmentId.toString(),
      answerId: attachment.answerId.toString(),
    };
  }
}
