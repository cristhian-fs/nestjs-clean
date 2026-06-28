import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AnswerEntity } from './answer.entity';
import { QuestionEntity } from './question.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ name: 'question_id', nullable: true })
  questionId?: string;

  @Column({ name: 'answer_id', nullable: true })
  answerId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'author_id' })
  author?: UserEntity;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'question_id' })
  question?: QuestionEntity;

  @ManyToOne(() => AnswerEntity)
  @JoinColumn({ name: 'answer_id' })
  answer?: AnswerEntity;
}
