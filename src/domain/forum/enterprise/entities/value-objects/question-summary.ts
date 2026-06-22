import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';
import { Slug } from './slug';

export interface QuestionSummaryProps {
  questionId: UniqueEntityID;
  authorId: UniqueEntityID;
  author: string;
  title: string;
  slug: Slug;
  excerpt: string;
  bestAnswerId?: UniqueEntityID | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionSummary extends ValueObject<QuestionSummaryProps> {
  get questionId() {
    return this.props.questionId;
  }
  get authorId() {
    return this.props.authorId;
  }
  get author() {
    return this.props.author;
  }
  get title() {
    return this.props.title;
  }
  get slug() {
    return this.props.slug;
  }
  get excerpt() {
    return this.props.excerpt;
  }
  get bestAnswerId() {
    return this.props.bestAnswerId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuestionSummaryProps) {
    return new QuestionSummary(props);
  }
}
