import { test, expect, describe, beforeEach } from "vitest";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository.js";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment.js";
import { makeAnswerComment } from "test/factories/make-answer-comment.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  test("should be able to delete a question comment", async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  test("should not be able to delete another user question comment", async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: "author-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
