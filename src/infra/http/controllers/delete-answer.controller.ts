import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer';

@Controller('/api/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const { sub } = user;

    const result = await this.deleteAnswer.execute({
      authorId: sub,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
