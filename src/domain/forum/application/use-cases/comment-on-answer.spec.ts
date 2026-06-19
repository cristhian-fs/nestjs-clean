import { test, expect, describe, beforeEach } from 'vitest';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository.js';
import { makeAnswer } from 'test/factories/make-answer.js';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository.js';
import { CommentOnAnswerUseCase } from './comment-on-answer.js';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository.js';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository.js';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    );
  });

  test('should be able to comment on a answer', async () => {
    const answer = makeAnswer();

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Answer comment',
    });

    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Answer comment',
    );
  });
});
