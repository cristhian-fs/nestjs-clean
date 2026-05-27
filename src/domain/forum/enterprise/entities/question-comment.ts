import type { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import type { Optional } from "@/@types/optional.js";
import { Comment, type CommentProps } from "./comment";

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId;
  }

  static create(
    props: Optional<QuestionCommentProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const answer = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return answer;
  }
}
