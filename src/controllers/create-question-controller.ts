import { Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

@Controller('/api/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user.sub);
    return 'ok';
  }
}
