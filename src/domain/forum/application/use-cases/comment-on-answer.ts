import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import type { AnswersRepository } from "../repositories/answers-repository";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { type Either, right, left } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) { }

  async execute({
    content,
    authorId,
    answerId,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({ answerComment });
  }
}
