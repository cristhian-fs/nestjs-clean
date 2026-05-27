import type { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import type { Optional } from "@/@types/optional.js";
import { Comment, type CommentProps } from "./comment";

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId;
  }
  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const answer = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return answer;
  }
}
