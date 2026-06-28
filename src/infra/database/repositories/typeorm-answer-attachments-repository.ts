import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachmentEntity } from '../entities/attachment.entity';
import { In, Repository } from 'typeorm';
import { TypeORMAnswerAttachmentMapper } from '../mappers/typeorm-answer-attachment-mapper';

@Injectable()
export class TypeORMAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  constructor(
    @InjectRepository(AttachmentEntity)
    private attachmentsRepo: Repository<AttachmentEntity>,
  ) {}

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const ids = attachments.map((a) => a.attachmentId.toString());
    const answerId = attachments[0].answerId.toString();

    await this.attachmentsRepo.update({ id: In(ids) }, { answerId });
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const ids = attachments.map((a) => a.attachmentId.toString());

    await this.attachmentsRepo.delete({ id: In(ids) });
  }
  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachments = await this.attachmentsRepo.find({
      where: { answerId },
    });

    return answerAttachments.map(TypeORMAnswerAttachmentMapper.toDomain);
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.attachmentsRepo.delete({
      answerId,
    });
  }
}
