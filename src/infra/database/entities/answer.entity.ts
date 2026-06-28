import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuestionEntity } from './question.entity';
import { AttachmentEntity } from './attachment.entity';
import { CommentEntity } from './comment.entity';

@Entity('answers')
export class AnswerEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(() => QuestionEntity, (question) => question.answers)
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @ManyToOne(() => UserEntity, (user) => user.answers)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.answer)
  attachments?: AttachmentEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.answer)
  comments?: CommentEntity[];
}
