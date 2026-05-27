import type { QuestionsRepository } from "../repositories/questions-repository.js";
import type { Question } from "../../enterprise/entities/question.js";
import { type Either, right } from "@/core/either.js";

interface FetchRecentQuestionsUseCaseRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) { }

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecents({ page });

    return right({ questions });
  }
}
