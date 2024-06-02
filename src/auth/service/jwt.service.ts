import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import {
  IJWTDecoded,
  IJWTPayload,
} from 'src/shared/interface/jwt-payload.interface';

@Injectable()
export class JwtService {
  constructor(protected jwtService: NestJwtService) {}

  sign(payload: IJWTPayload): string {
    return this.jwtService.sign(payload);
  }

  verify(jwt_token: string): IJWTDecoded {
    return this.jwtService.verify(jwt_token);
  }

  decode(jwt_token: string): string | Record<string, any> {
    return this.jwtService.decode(jwt_token);
  }
}
