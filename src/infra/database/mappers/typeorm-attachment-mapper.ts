import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { AttachmentEntity } from '../entities/attachment.entity';

export class TypeORMAttachmentMapper {
  static toPersistence(attachment: Attachment): AttachmentEntity {
    const entity = new AttachmentEntity();
    entity.id = attachment.id.toString();
    entity.title = attachment.title;
    entity.url = attachment.url;
    return entity;
  }
  static toDomain(raw: AttachmentEntity): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
