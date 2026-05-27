import { test, expect, describe, beforeEach } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository.js";
import { DeleteAnswerUseCase } from "./delete-answer.js";
import { makeAnswer } from "test/factories/make-answer.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository.js";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  test("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: "answer-1",
      authorId: "author-1",
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  test("should not be able to delete a answer from another user", async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: "answer-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
