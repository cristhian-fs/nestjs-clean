import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment';

@Controller('/api/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswer: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const { sub } = user;

    const result = await this.deleteAnswer.execute({
      authorId: sub,
      answerCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
