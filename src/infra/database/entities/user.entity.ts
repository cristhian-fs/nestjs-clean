import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { AnswerEntity } from './answer.entity';
import { AttachmentEntity } from './attachment.entity';
import { NotificationEntity } from './notification.entity';

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
}

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @OneToMany(() => QuestionEntity, (question) => question.author)
  questions?: QuestionEntity[];

  @OneToMany(() => AnswerEntity, (answer) => answer.author)
  answers?: AnswerEntity[];

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.user)
  attachments?: AttachmentEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.recipient)
  notifications?: NotificationEntity[];
}
