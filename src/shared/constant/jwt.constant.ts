import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

export const jwtConstants = {
  secretOrPrivateKey: configService.get<string>('JWT_SECRET', 'secret1234'),
};
