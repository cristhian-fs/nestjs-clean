import { QuestionsRepository } from '../repositories/questions-repository';
import { type Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { QuestionSummary } from '../../enterprise/entities/value-objects/question-summary';

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: QuestionSummary[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecentsWithAuthor({
      page,
    });

    return right({ questions });
  }
}
