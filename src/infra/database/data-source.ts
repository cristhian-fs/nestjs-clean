import 'dotenv/config';
import { DataSource } from 'typeorm';
import { QuestionEntity } from './entities/question.entity';
import { AnswerEntity } from './entities/answer.entity';
import { UserEntity } from './entities/user.entity';
import { AttachmentEntity } from './entities/attachment.entity';
import { NotificationEntity } from './entities/notification.entity';
import { CommentEntity } from './entities/comment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    QuestionEntity,
    AnswerEntity,
    UserEntity,
    AttachmentEntity,
    NotificationEntity,
    CommentEntity,
  ],
  migrations: ['src/infra/database/migrations/*.ts'],
  synchronize: false,
});
