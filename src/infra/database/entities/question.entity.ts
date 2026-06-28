import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AnswerEntity } from './answer.entity';
import { AttachmentEntity } from './attachment.entity';
import { CommentEntity } from './comment.entity';

@Entity('questions')
export class QuestionEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  content: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ name: 'best_answer_id', nullable: true })
  bestAnswerId?: string;

  @OneToOne(() => AnswerEntity, { nullable: true })
  @JoinColumn({ name: 'best_answer_id' })
  bestAnswer?: AnswerEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.questions)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.question)
  answers?: AnswerEntity[];

  @OneToMany(() => AttachmentEntity, (attachment) => attachment.question)
  attachments?: AttachmentEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.question)
  comments?: CommentEntity[];
}
