import { faker } from "@faker-js/faker";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  type AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const question = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id,
  );

  return question;
}
