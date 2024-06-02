import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/shared/schema/auth.schema';
import { jwtConstants } from 'src/shared/constant/jwt.constant';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtService } from './service/jwt.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: jwtConstants.secretOrPrivateKey,
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthSchema,
        collection: 'auths',
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, LocalStrategy, JwtStrategy],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
