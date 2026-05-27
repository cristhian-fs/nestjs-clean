import { test, expect, describe, beforeEach } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { DeleteAnswerUseCase } from "./delete-answer.js";
import { makeAnswer } from "test/factories/make-answer.js";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository.js";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer.js";
import { makeQuestion } from "test/factories/make-question.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository.js";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose Question Best Answer", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    );
  });

  test("should be able to choose the best answer from a question", async () => {
    const newQuestion = makeQuestion();

    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      answerId: newAnswer.id.toString(),
    });

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      newAnswer.id,
    );
  });

  test("should not be able to delete a answer from another user", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: newAnswer.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
