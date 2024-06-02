import { Server } from 'socket.io';
import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
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
import { WebsocketAuthenticationMiddleware } from 'src/shared/middleware/websocket/websocket.authentication.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
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
  handlePing(client: SocketIO, data: string): string {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return 'pong';
  }

  @SubscribeMessage('join_chat_room')
  async handleJoinRoom(client: SocketIO, chat_id: string): Promise<boolean> {
    try {
      this.logger.log(
        `Join chat room request received from client id: ${client.id}`,
      );
      this.logger.debug(`Payload: ${chat_id}`);
      client.join(chat_id);

      // console.log(await this.server.in(chat_id).fetchSockets());
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(client: SocketIO, message: string): Promise<boolean> {
    try {
      this.logger.log(
        `Join chat room request received from client id: ${client.id}`,
      );
      this.logger.debug(`Payload: ${message}`);
      client.to('ping').emit('receive_message', message);

      // console.log(await this.server.in(chat_id).fetchSockets());
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
