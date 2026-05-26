import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/env';
import z from 'zod';
import { Injectable } from '@nestjs/common';

const tokenSchema = z.object({
  sub: z.uuid(),
});

type TokenSchema = z.infer<typeof tokenSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: TokenSchema) {
    return tokenSchema.parse(payload);
  }
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }
}
