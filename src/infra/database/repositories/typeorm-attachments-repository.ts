import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachmentEntity } from '../entities/attachment.entity';
import { Repository } from 'typeorm';
import { TypeORMAttachmentMapper } from '../mappers/typeorm-attachment-mapper';

@Injectable()
export class TypeORMAttachmentsRepository implements AttachmentsRepository {
  constructor(
    @InjectRepository(AttachmentEntity)
    private repo: Repository<AttachmentEntity>,
  ) {}
  async create(attachment: Attachment): Promise<void> {
    const data = TypeORMAttachmentMapper.toPersistence(attachment);

    await this.repo.save(this.repo.create(data));
  }
}
