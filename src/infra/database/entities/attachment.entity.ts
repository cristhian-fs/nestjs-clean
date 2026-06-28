import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { AnswerEntity } from './answer.entity';
import { UserEntity } from './user.entity';

@Entity('attachments')
export class AttachmentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column({ name: 'question_id', nullable: true })
  questionId?: string;

  @Column({ name: 'answer_id', nullable: true })
  answerId?: string;

  @ManyToOne(() => QuestionEntity, (question) => question.attachments)
  @JoinColumn({ name: 'question_id' })
  question?: QuestionEntity;

  @ManyToOne(() => AnswerEntity, (answer) => answer.attachments)
  @JoinColumn({ name: 'answer_id' })
  answer?: AnswerEntity;

  @ManyToOne(() => UserEntity, (user) => user.attachments)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
