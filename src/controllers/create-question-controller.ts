import { Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

@Controller('/sessions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle() {
    return 'ok';
  }
}
