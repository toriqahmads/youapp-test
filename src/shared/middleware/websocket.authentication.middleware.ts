import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from 'src/auth/service/jwt.service';
import { SocketIOMiddleware } from '../type/socket.io.middleware.type';

export const WebsocketAuthenticationMiddleware = (
  jwtService: JwtService,
  authService: AuthService,
): SocketIOMiddleware => {
  return async (socket: Socket, next) => {
    try {
      const { authorization } = socket.handshake.headers;

      if (!authorization || (authorization && authorization === '')) {
        throw new UnauthorizedException(`JWT bearer token not provied`);
      }

      const token = authorization.split(' ')[1].trim();
      const user = jwtService.verify(token);

      const auth = await authService.findByUserId(user.id);
      if (!auth) {
        throw new UnauthorizedException(`access token has been revoked`);
      }

      socket = Object.assign(socket, {
        user,
      });

      next();
    } catch (error) {
      next(new UnauthorizedException('Unauthorized'));
    }
  };
};
