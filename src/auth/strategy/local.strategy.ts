import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/shared/schema/user.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username_or_email',
      passwordField: 'password',
    });
  }

  async validate(
    username_or_email: string,
    password: string,
  ): Promise<Partial<User>> {
    const user = await this.authService.validateUser(
      username_or_email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
