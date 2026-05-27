import { test, expect, describe, beforeEach } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository.js";
import { CreateQuestionUseCase } from "./create-question.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository.js";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe("Answer Use Case", () => {
  beforeEach(() => {

    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository);
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  test("should be able to create a question", async () => {
    const result = await sut.execute({
      content: "Question content",
      authorId: "1",
      title: "New question",
      attachmentsIds: ["1", "2"],
    });

    expect(result.value?.question.content).toEqual("Question content");
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question,
    );
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ]);
  });
});
