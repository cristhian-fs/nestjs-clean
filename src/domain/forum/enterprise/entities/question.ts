import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Slug } from './value-objects/slug';
import type { Optional } from '@/@types/optional';
import { AggregateRoot } from '@/core/entities/aggregate-root';
import { QuestionAttachmentList } from './question-attachment-list';

export interface QuestionProps {
  title: string;
  content: string;
  authorId: UniqueEntityID;
  bestAnswerId?: UniqueEntityID | null;
  slug: Slug;
  createdAt: Date;
  updatedAt?: Date | null;
  attachments: QuestionAttachmentList;
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get slug() {
    return this.props.slug;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get attachments() {
    return this.props.attachments;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);

    this.touch();
  }

  set content(content: string) {
    this.props.content = content;

    this.touch();
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList([]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return question;
  }
}
