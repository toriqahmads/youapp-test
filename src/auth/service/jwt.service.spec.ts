import { JwtService } from './jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/shared/constant/jwt.constant';
import {
  IJWTDecoded,
  IJWTPayload,
} from 'src/shared/interface/jwt-payload.interface';

describe('AuthenticationService Testing', () => {
  const jwtService: JwtService = new JwtService(
    new NestJwtService({
      secret: jwtConstants.secretOrPrivateKey,
      signOptions: {
        expiresIn: '1h',
      },
    }),
  );

  let token: string;

  const user = {
    id: '165ad6de39eaf3baf42579e9',
    email: 'test2@gmail.com',
    username: 'test2',
  };

  describe('JwtService', () => {
    it('should be defined', () => {
      expect(jwtService).toBeDefined();
    });
  });

  describe('sign', () => {
    const jwtPayload: IJWTPayload = user;

    const result = jwtService.sign(jwtPayload);
    expect(result).toBeTruthy();

    token = result;
  });

  describe('verify', () => {
    const result = jwtService.verify(token);
    expect(result).toBeTruthy();
    expect(result.email).toEqual(user.email);
    expect(result.username).toEqual(user.username);
  });

  describe('decode', () => {
    const result = jwtService.decode(token) as IJWTDecoded;
    expect(result).toBeTruthy();
    expect(result.email).toEqual(user.email);
    expect(result.username).toEqual(user.username);
  });
});
