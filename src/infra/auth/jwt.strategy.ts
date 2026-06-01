import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import z from 'zod';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

const tokenPayload = z.object({
  sub: z.uuid(),
});

export type UserPayload = z.infer<typeof tokenPayload>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: UserPayload) {
    return tokenPayload.parse(payload);
  }
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }
}
