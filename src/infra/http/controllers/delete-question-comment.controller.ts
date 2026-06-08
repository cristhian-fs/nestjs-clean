import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment';

@Controller('/api/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestion: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionCommentId: string,
  ) {
    const { sub } = user;

    const result = await this.deleteQuestion.execute({
      authorId: sub,
      questionCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
