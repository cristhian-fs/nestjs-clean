import { test, expect, describe, beforeEach } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent Questions", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  test("should be able to get recent questions", async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2025, 11, 1) }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2025, 11, 2) }),
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2025, 11, 3) }),
    );

    const result = await sut.execute({
      page: 1,
    });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 11, 3) }),
      expect.objectContaining({ createdAt: new Date(2025, 11, 2) }),
      expect.objectContaining({ createdAt: new Date(2025, 11, 1) }),
    ]);
  });

  test("should be able to get paginated questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({
      page: 2,
    });

    expect(result.value?.questions).toHaveLength(2);
  });
});
