import { test, expect, describe, beforeEach } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer Answers", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  test("should be able to get the answer answers", async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-1"),
      }),
    );
    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.value?.answerComments).toHaveLength(3);
  });

  test("should be able to get paginated answer answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.value?.answerComments).toHaveLength(2);
  });
});
