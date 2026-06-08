import { type Either, right, left } from '@/core/either.js';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import { NotAllowedError } from './errors/not-allowed-error.js';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  unknown
>;

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) return left(new ResourceNotFoundError());

    if (authorId.toString() !== questionComment.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right({});
  }
}
