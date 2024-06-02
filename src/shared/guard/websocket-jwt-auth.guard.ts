import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { IJWTPayload } from '../interface/jwt-payload.interface';
import { AuthService } from 'src/auth/service/auth.service';
import { JwtService } from 'src/auth/service/jwt.service';

@Injectable()
export class WebsocketJwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    const user = await this.validate(client);

    context.switchToWs().getClient().user = user;

    return true;
  }

  async validate(client: Socket): Promise<IJWTPayload> {
    const { authorization } = client.handshake.headers;

    if (!authorization || (authorization && authorization === '')) {
      throw new UnauthorizedException(`JWT bearer token not provied`);
    }

    const decoded = this.jwtService.verify(authorization);
    const auth = await this.authService.findByUserId(decoded.id);
    if (!auth) {
      throw new UnauthorizedException(`access token has been revoked`);
    }
    return decoded;
  }
}
