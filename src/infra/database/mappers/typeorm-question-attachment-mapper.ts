import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { AttachmentEntity } from '../entities/attachment.entity';

export class TypeORMQuestionAttachmentMapper {
  static toDomain(raw: AttachmentEntity): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.');
    }
    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(
    attachment: QuestionAttachment,
  ): Partial<AttachmentEntity> {
    return {
      id: attachment.attachmentId.toString(),
      questionId: attachment.questionId.toString(),
    };
  }
}
