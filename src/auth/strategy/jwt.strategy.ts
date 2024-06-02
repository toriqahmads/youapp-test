import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { jwtConstants } from 'src/shared/constant/jwt.constant';
import { IJWTPayload } from '../../shared/interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secretOrPrivateKey,
    });
  }

  async validate(payload: IJWTPayload): Promise<IJWTPayload> {
    const auth = await this.authService.findByUserId(payload.id);
    if (!auth) {
      throw new UnauthorizedException(`access token has been revoked`);
    }

    return {
      id: payload.id,
      email: payload.email,
      username: payload.username,
    };
  }
}
