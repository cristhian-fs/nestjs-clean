import { test, expect, describe, beforeEach } from 'vitest';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository.js';
import { CreateQuestionUseCase } from './create-question.js';
import { UniqueEntityID } from '@/core/entities/unique-entity-id.js';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository.js';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository.js';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe('Answer Use Case', () => {
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
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  test('should be able to create a question', async () => {
    const result = await sut.execute({
      content: 'Question content',
      authorId: '1',
      title: 'New question',
      attachmentsIds: ['1', '2'],
    });

    expect(result.value?.question.content).toEqual('Question content');
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question,
    );
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });
  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      content: 'Question content',
      authorId: '1',
      title: 'New question',
      attachmentsIds: ['1', '2'],
    });

    expect(result.value?.question.content).toEqual('Question content');
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    );
  });
});
