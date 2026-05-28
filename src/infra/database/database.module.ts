import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaQuestionsRepository } from './repositories/prisma-questions-repository';
import { PrismaQuestionAttachmentsRepository } from './repositories/prisma-question-attachments-repository';
import { PrismaQuestionCommentsRepository } from './repositories/prisma-question-comments-repository';
import { PrismaAnswersRepository } from './repositories/prisma-answers-repository';
import { PrismaAnswerAttachmentsRepository } from './repositories/prisma-answer-attachments-repository';
import { PrismaAnswerCommentsRepository } from './repositories/prisma-answer-comments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

@Module({
  providers: [
    PrismaService,
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository
		},
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
  ],
})
export class DatabaseModule {}
