import { type Either, right, left } from "@/core/either";
import type { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "./errors/not-allowed-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface DeleteQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {}
>;

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) { }

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) return left(new ResourceNotFoundError());

    if (question.authorId.toString() !== authorId)
      return left(new NotAllowedError());

    await this.questionsRepository.delete(question);

    return right({});
  }
}
