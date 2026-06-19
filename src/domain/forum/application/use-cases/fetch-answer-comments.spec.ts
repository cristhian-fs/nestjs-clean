import { test, expect, describe, beforeEach } from 'vitest';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer Answers', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  test('should be able to get the answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });
    await inMemoryAnswerCommentsRepository.create(comment1);

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });
    await inMemoryAnswerCommentsRepository.create(comment2);

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });
    await inMemoryAnswerCommentsRepository.create(comment3);
    const result = await sut.execute({
      page: 1,
      answerId: 'answer-1',
    });

    expect(result.value?.comments).toHaveLength(3);
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
    ]);
  });

  test('should be able to get paginated answer answers', async () => {
    const student = makeStudent({ name: 'John Doe' });

    inMemoryStudentsRepository.items.push(student);
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: 'answer-1',
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
