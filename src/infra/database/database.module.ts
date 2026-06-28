import { Module } from '@nestjs/common';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { CacheModule } from '../cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { QuestionEntity } from './entities/question.entity';
import { UserEntity } from './entities/user.entity';
import { AttachmentEntity } from './entities/attachment.entity';
import { CommentEntity } from './entities/comment.entity';
import { NotificationEntity } from './entities/notification.entity';
import { AnswerEntity } from './entities/answer.entity';
import { TypeORMQuestionsRepository } from './repositories/typeorm-questions-repository';
import { TypeORMStudentsRepository } from './repositories/typeorm-students-repository';
import { TypeORMQuestionAttachmentsRepository } from './repositories/typeorm-question-attachments-repository';
import { TypeORMQuestionCommentsRepository } from './repositories/typeorm-question-comments-repository';
import { TypeORMAnswersRepository } from './repositories/typeorm-answers-repository';
import { TypeORMAnswerAttachmentsRepository } from './repositories/typeorm-answer-attachments-repository';
import { TypeORmAnswerCommentsRepository } from './repositories/typeorm-answer-comments-repository';
import { TypeORMAttachmentsRepository } from './repositories/typeorm-attachments-repository';
import { TypeORMNotificationsRepository } from './repositories/typeorm-notications-repository';

@Module({
  imports: [
    CacheModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        type: 'postgres',
        url: env.get('DATABASE_URL'),
        entities: [
          QuestionEntity,
          UserEntity,
          AttachmentEntity,
          CommentEntity,
          NotificationEntity,
          AnswerEntity,
        ],
        migrations: [__dirname + '/migrations/*.{ts,js}'],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([
      QuestionEntity,
      UserEntity,
      AttachmentEntity,
      CommentEntity,
      NotificationEntity,
      AnswerEntity,
    ]),
  ],
  providers: [
    {
      provide: QuestionsRepository,
      useClass: TypeORMQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: TypeORMStudentsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: TypeORMQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: TypeORMQuestionCommentsRepository,
    },
    { provide: AnswersRepository, useClass: TypeORMAnswersRepository },
    {
      provide: AnswerAttachmentsRepository,
      useClass: TypeORMAnswerAttachmentsRepository,
    },
    {
      provide: AnswerCommentsRepository,
      useClass: TypeORmAnswerCommentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: TypeORMAttachmentsRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: TypeORMNotificationsRepository,
    },
  ],
  exports: [
    QuestionsRepository,
    StudentsRepository,
    QuestionAttachmentsRepository,
    QuestionCommentsRepository,
    AnswersRepository,
    AnswerAttachmentsRepository,
    AnswerCommentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
