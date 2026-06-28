import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachmentEntity } from '../entities/attachment.entity';
import { In, Repository } from 'typeorm';
import { TypeORMQuestionAttachmentMapper } from '../mappers/typeorm-question-attachment-mapper';

@Injectable()
export class TypeORMQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  constructor(
    @InjectRepository(AttachmentEntity)
    private repo: Repository<AttachmentEntity>,
  ) {}

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    const ids = attachments.map((a) => a.attachmentId.toString());
    const questionId = attachments[0].questionId.toString();

    await this.repo.update({ id: In(ids) }, { questionId });
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    if (attachments.length === 0) return;

    await this.repo.delete({
      id: In(attachments.map((a) => a.attachmentId.toString())),
    });
  }
  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.repo.find({
      where: { questionId },
    });

    return questionAttachments.map(TypeORMQuestionAttachmentMapper.toDomain);
  }
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.repo.delete({
      questionId,
    });
  }
}
