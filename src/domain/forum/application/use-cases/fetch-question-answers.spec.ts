import { test, expect, describe, beforeEach } from 'vitest';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';
import { makeAnswer } from 'test/factories/make-answer';
import { makeStudent } from 'test/factories/make-student';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  test('should be able to get the question answers', async () => {
    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1'), authorId: student.id }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1'), authorId: student.id }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1'), authorId: student.id }),
    );

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    });

    expect(result.value?.answers).toHaveLength(3);
  });

  test('should be able to get paginated question answers', async () => {
    const student = makeStudent();
    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1'), authorId: student.id }),
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    });

    expect(result.value?.answers).toHaveLength(2);
  });
});
