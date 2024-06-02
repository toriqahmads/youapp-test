import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { jwtConstants } from 'src/shared/constant/jwt.constant';
import { Chat, ChatSchema } from 'src/shared/schema/chat.schema';
import { Message, MessageSchema } from 'src/shared/schema/message.schema';
import { ChatGateway } from './gateway/chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { SocketSessionService } from './service/socket.session.service';
import {
  SocketSession,
  SocketSessionSchema,
} from 'src/shared/schema/socket.session.schema';

@Module({
  imports: [
    AuthModule,
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
        name: Chat.name,
        schema: ChatSchema,
        collection: 'chats',
      },
      {
        name: Message.name,
        schema: MessageSchema,
        collection: 'messages',
      },
      {
        name: SocketSession.name,
        schema: SocketSessionSchema,
        collection: 'socket_sessions',
      },
    ]),
  ],
  controllers: [],
  providers: [ChatGateway, SocketSessionService],
  exports: [],
})
export class ChatModule {}
