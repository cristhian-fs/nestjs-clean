import { test, expect, describe, beforeEach } from 'vitest';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  test('should be able to get the question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    });
    await inMemoryQuestionCommentsRepository.create(comment1);

    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    });
    await inMemoryQuestionCommentsRepository.create(comment2);

    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    });
    await inMemoryQuestionCommentsRepository.create(comment3);

    const result = await sut.execute({
      page: 1,
      questionId: 'question-1',
    });

    expect(result.value?.questionComments).toHaveLength(3);
    expect(result.value?.questionComments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment2.id,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment3.id,
          author: 'John Doe',
        }),
      ]),
    );
  });

  test('should be able to get paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: 'question-1',
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });
});
