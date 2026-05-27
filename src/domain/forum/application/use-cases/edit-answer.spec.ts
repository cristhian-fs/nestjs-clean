import { test, expect, describe, beforeEach } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new EditAnswerUseCase(inMemoryAnswerRepository);
  });

  test("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswerRepository.create(newAnswer);

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: "author-1",
      content: "edited content",
    });

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: "edited content",
    });
  });

  test("should not be able to edit a answer from another user", async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID("author-1"),
      },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswerRepository.create(answer);

    const result = await sut.execute({
      authorId: "author-2",
      answerId: "answer-1",
      content: "edited content",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
