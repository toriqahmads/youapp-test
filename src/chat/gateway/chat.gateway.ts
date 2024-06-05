import { Types } from 'mongoose';
import { Server } from 'socket.io';
import {
  Injectable,
  Logger,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/service/auth.service';
import { SocketIO } from 'src/shared/type/socket.io.type';
import { JwtService } from 'src/auth/service/jwt.service';
import { SocketSessionService } from '../service/socket.session.service';
import { WebsocketJwtAuthGuard } from 'src/shared/guard/websocket-jwt-auth.guard';
import { JoinChatRoomDto } from '../dto/chat/join.chat.room.dto';
import { WebsocketAuthenticationMiddleware } from 'src/shared/middleware/websocket/websocket.authentication.middleware';
import { WebsocketValidationPipe } from 'src/shared/validation.pipe/websocket.validation.pipe';
import { WebsocketExceptionsFilter } from 'src/shared/filter/websocket.exception.filter';
import { SendMessageDto } from '../dto/chat/send.message.dto';
import { ChatService } from '../service/chat.service';
import { MessageService } from '../service/message.service';
import { WebsocketUpdateMessageDto } from '../dto/message/websocket.update.message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UsePipes(new WebsocketValidationPipe())
@UseFilters(new WebsocketExceptionsFilter())
@Injectable()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  public server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly socketSessionService: SocketSessionService,
  ) {}

  afterInit(@ConnectedSocket() socket: SocketIO) {
    socket.use(
      WebsocketAuthenticationMiddleware(
        this.jwtService,
        this.authService,
      ) as any,
    );
    this.logger.log('Initialized');
  }

  @UseGuards(WebsocketJwtAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(client: SocketIO, ..._args: any[]) {
    try {
      this.logger.log(`Client id: ${client.id} connected`);
      const socketSession = await this.socketSessionService.create({
        user_id: client.user.id,
        socket_id: client.id,
      });
      this.logger.log(`socket session saved ${socketSession.socket_id}`);

      // TO DO
      // Notify all message not delivered to connected client
    } catch (err) {
      return Promise.resolve(err);
    }
  }

  async handleDisconnect(client: SocketIO) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
    try {
      this.logger.log(`Client id: ${client.id} connected`);
      const socketSession = await this.socketSessionService.destroyBySocketId(
        client.id,
      );
      this.logger.log(`socket session destroyed ${socketSession.socket_id}`);
    } catch (err) {
      return Promise.resolve(err);
    }
  }

  @SubscribeMessage('ping')
  handlePing(client: SocketIO): string {
    this.logger.log(`Message received from client id: ${client.id}`);
    return 'pong';
  }

  @SubscribeMessage('join_chat_room')
  async handleJoinRoom(
    @MessageBody() data: JoinChatRoomDto,
    @ConnectedSocket() client: SocketIO,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `Join chat room request received from client id: ${client.id}`,
      );
      this.logger.debug(`Payload: ${data.chat_id}`);
      client.join(data.chat_id);
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() message: SendMessageDto,
    @ConnectedSocket() client: SocketIO,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `Send message request received from client id: ${client.id}`,
      );
      this.logger.debug(`Payload: ${message}`);

      const sendMessage = await this.chatService.sendMessage(
        message,
        new Types.ObjectId(client.user.id),
      );

      client
        .to(sendMessage.chat.id)
        .emit('receive_message', sendMessage.message);

      const uniqueClient = await this.getClientNotInRoom(
        sendMessage.chat.id,
        sendMessage.chat.participants as Array<string>,
        client.id,
      );

      this.notifyToAllNotInRoom(
        uniqueClient.socket_id,
        'receive_message',
        sendMessage.message,
      );

      await this.messageService.deliveredMessage(
        sendMessage.message.id,
        uniqueClient.user_id.map((u) => new Types.ObjectId(u)),
      );

      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  @SubscribeMessage('update_message')
  async handleUpdateMessage(
    @MessageBody() message: WebsocketUpdateMessageDto,
    @ConnectedSocket() client: SocketIO,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `Update message request received from client id: ${client.id}`,
      );
      this.logger.debug(`Payload: ${message}`);

      const { message_id, ...updateMessageDto } = message;
      const updatedMessage = await this.messageService.update(
        message_id,
        updateMessageDto,
      );

      client
        .to(updatedMessage.chat as string)
        .emit('message_updated', updatedMessage);

      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  @SubscribeMessage('read_message')
  async handleReadMessage(
    @MessageBody() message_id: string,
    @ConnectedSocket() client: SocketIO,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `Read message request received from client id: ${client.id}`,
      );
      this.logger.debug(`Payload: ${message_id}`);

      await this.messageService.readMessage(message_id, [
        new Types.ObjectId(client.user.id),
      ]);

      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async getClientNotInRoom(
    room: string | number | Types.ObjectId,
    participants: Array<string>,
    socket_sender?: string,
  ): Promise<{ socket_id: string[]; user_id: string[] }> {
    let uniqueSocketId: string[] = [];
    let uniqueUserId: string[] = [];
    try {
      const allSocketInRoom = await this.server
        .in(room.toString())
        .fetchSockets();

      const socketParticipants =
        await this.socketSessionService.findAllByUserId(
          participants.map((p) => {
            return new Types.ObjectId(p);
          }),
        );

      const allSocketIdInRoom: string[] = [];
      const allUserIdInRoom: string[] = [];
      allSocketInRoom.forEach((s) => {
        allSocketIdInRoom.push(s.id);
        allUserIdInRoom.push((s as unknown as SocketIO).user.id);
      });

      const allSocketIdParticipants: string[] = [];
      const allUserIdParticipants: string[] = [];
      socketParticipants.forEach((s) => {
        allSocketIdParticipants.push(s.socket_id);
        allUserIdParticipants.push(s.user.toString());
      });

      uniqueSocketId = allSocketIdParticipants.filter((obj) => {
        return allSocketIdInRoom.indexOf(obj) == -1;
      });
      uniqueUserId = allUserIdParticipants.filter((obj) => {
        return allUserIdInRoom.indexOf(obj) == -1;
      });

      if (socket_sender) {
        uniqueSocketId = uniqueSocketId.filter((us) => us !== socket_sender);
      }

      uniqueUserId.push(...allUserIdInRoom);

      return Promise.resolve({
        socket_id: uniqueSocketId,
        user_id: uniqueUserId,
      });
    } catch (err) {
      return Promise.resolve({
        socket_id: uniqueSocketId,
        user_id: uniqueUserId,
      });
    }
  }

  async notifyToAllNotInRoom(
    socket_ids: string[],
    event_name: string,
    data?: any,
  ): Promise<void> {
    try {
      if (socket_ids && socket_ids.length > 0) {
        this.server.to(socket_ids).emit(event_name, data);
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.resolve();
    }
  }
}
