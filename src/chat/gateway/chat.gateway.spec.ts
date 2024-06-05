import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { JwtService } from 'src/auth/service/jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/shared/constant/jwt.constant';
import { MessageService } from '../service/message.service';
import { ChatService } from '../service/chat.service';
import { SocketSessionService } from '../service/socket.session.service';
import { AuthService } from 'src/auth/service/auth.service';
import { SocketIO } from 'src/shared/type/socket.io.type';
import { IJWTPayload } from 'src/shared/interface/jwt-payload.interface';
import { JoinChatRoomDto } from '../dto/chat/join.chat.room.dto';
import { WebsocketUpdateMessageDto } from '../dto/message/websocket.update.message.dto';
import { MessageType } from 'src/shared/enum/message.enum';
import { Types } from 'mongoose';
import { SendMessageDto } from '../dto/chat/send.message.dto';
import { Server } from 'socket.io';

const TestCase = {
  positive: {
    update: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
      expected: {
        chat: '123455666',
        id: '265ad6de39eaf3baf42579e9a',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
    },
    sendMessage: {
      input: {
        participants: ['665cb5f46f83bb4d8c18e5ae', '665ad6de39eaf3baf42579c1'],
        chat_name: 'test',
        is_group: false,
        recipient: '165ad6de39eaf3baf42579e9',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
      sockets: [
        {
          user_id: '665cb5f46f83bb4d8c18e5ae',
          socket_id: 'aaa',
          user: {
            id: '665cb5f46f83bb4d8c18e5ae',
          },
        },
        {
          user_id: '665ad6de39eaf3baf42579c1',
          socket_id: 'bbb',
          user: {
            id: '665ad6de39eaf3baf42579c1',
          },
        },
      ],
      socketFromDb: [
        {
          user_id: '665cb5f46f83bb4d8c18e5ae',
          socket_id: 'aaa',
          user: '665cb5f46f83bb4d8c18e5ae',
        },
        {
          user_id: '665ad6de39eaf3baf42579c1',
          socket_id: 'bbb',
          user: '665ad6de39eaf3baf42579c1',
        },
      ],
      expected: {
        chat: {
          id: '123455666',
          participants: [
            '665cb5f46f83bb4d8c18e5ae',
            '665ad6de39eaf3baf42579c1',
          ],
        },
        message: {
          id: '265ad6de39eaf3baf42579e9a',
          chat_name: 'test',
          is_group: false,
          recipient: '165ad6de39eaf3baf42579e9',
          body: 'text message',
          type: MessageType.TEXT,
          reply_for_message: '165ad6de39eaf3baf42579e9',
          attachments: ['http://localhost.com/a'],
        },
      },
    },
  },
};

describe('Chat Gateway Testing', () => {
  let chatGateway: ChatGateway;

  const mockSocketService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    destroyBySocketId: jest.fn(),
    findByUserId: jest.fn(),
    findAllByUserId: jest.fn(),
  };

  const mockMessageService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findMyMessages: jest.fn(),
    readMessage: jest.fn(),
    deliveredMessage: jest.fn(),
  };

  const mockChatService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findMyChats: jest.fn(),
    sendMessage: jest.fn(),
  };

  const mockAuthService = {
    register: jest.fn(),
    logout: jest.fn(),
    login: jest.fn(),
    loginByRefreshToken: jest.fn(),
  };

  class MocketSocketIo {
    id: string;
    user: Partial<IJWTPayload>;
    constructor(properties) {
      Object.assign(this, properties);
    }
    emit() {
      return jest.fn();
    }
    to() {
      return this;
    }
    use() {
      return jest.fn();
    }
    join() {
      return jest.fn();
    }
    static to = jest.fn();
    static join = jest.fn();
    static use = jest.fn();
    static emit = jest.fn();
  }

  class MockedServerIo {
    constructor(properties) {
      Object.assign(this, properties);
    }
    emit() {
      return jest.fn();
    }
    to() {
      return this;
    }
    in() {
      return this;
    }
    use() {
      return jest.fn();
    }
    join() {
      return jest.fn();
    }
    fetchSockets() {
      return jest.fn();
    }
    static to = jest.fn();
    static join = jest.fn();
    static use = jest.fn();
    static emit = jest.fn();
  }

  const user = {
    id: '665ad6de39eaf3baf42579c1',
    email: 'test@gmail.com',
    messagename: 'test',
  };
  const socket = new MocketSocketIo({ id: 'aaa', user });
  const socketServer = new MockedServerIo({ id: 'aaa' });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        {
          provide: JwtService,
          useValue: new JwtService(
            new NestJwtService({
              secret: jwtConstants.secretOrPrivateKey,
              signOptions: {
                expiresIn: '1h',
              },
            }),
          ),
        },
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: SocketSessionService,
          useValue: mockSocketService,
        },
      ],
    }).compile();

    chatGateway = app.get<ChatGateway>(ChatGateway);
    chatGateway.server = socketServer as unknown as Server;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Chat Gateway', () => {
    it('should be defined', () => {
      expect(chatGateway).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('afterInit', () => {
      it('should be called afterInit', () => {
        jest.spyOn(MocketSocketIo.prototype, 'use');
        chatGateway.afterInit(socket as unknown as SocketIO);

        expect(MocketSocketIo.prototype.use).toHaveBeenCalledTimes(1);
      });
    });

    describe('handleConnection', () => {
      it('should be called handleConnection', () => {
        jest.spyOn(mockSocketService, 'create');
        chatGateway.handleConnection(socket as unknown as SocketIO);

        expect(mockSocketService.create).toHaveBeenCalledTimes(1);
        expect(mockSocketService.create).toHaveBeenCalledWith({
          user_id: socket.user.id,
          socket_id: socket.id,
        });
      });
    });

    describe('handleDisconnect', () => {
      it('should be called handleDisconnect', () => {
        jest.spyOn(mockSocketService, 'destroyBySocketId');
        chatGateway.handleDisconnect(socket as unknown as SocketIO);
        expect(mockSocketService.destroyBySocketId).toHaveBeenCalledTimes(1);
        expect(mockSocketService.destroyBySocketId).toHaveBeenCalledWith(
          socket.id,
        );
      });
    });

    describe('handlePing', () => {
      it('should be called handlePing', () => {
        const ping = chatGateway.handlePing(socket as unknown as SocketIO);
        expect(ping).toBe('pong');
      });
    });

    describe('handleJoinRoom', () => {
      it('should be called handleJoinRoom', async () => {
        const chat_id = '12344555';
        const joinRoomDto: JoinChatRoomDto = new JoinChatRoomDto();
        Object.assign(joinRoomDto, { chat_id });

        jest.spyOn(MocketSocketIo.prototype, 'join');
        const join = await chatGateway.handleJoinRoom(
          joinRoomDto,
          socket as unknown as SocketIO,
        );
        expect(join).toBe(true);
        expect(MocketSocketIo.prototype.join).toHaveBeenCalledTimes(1);
        expect(MocketSocketIo.prototype.join).toHaveBeenCalledWith(chat_id);
      });
    });

    describe('handleUpdateMessage', () => {
      it('should be called handleUpdateMessage', async () => {
        const updateMessageDto: WebsocketUpdateMessageDto =
          new WebsocketUpdateMessageDto();
        Object.assign(updateMessageDto, {
          ...TestCase.positive.update.input,
          message_id: TestCase.positive.update.input.id,
        });

        jest.spyOn(MocketSocketIo.prototype, 'to');
        jest.spyOn(MocketSocketIo.prototype, 'emit');
        jest
          .spyOn(mockMessageService, 'update')
          .mockResolvedValueOnce(TestCase.positive.update.expected);
        const join = await chatGateway.handleUpdateMessage(
          updateMessageDto,
          socket as unknown as SocketIO,
        );
        expect(join).toBe(true);
        expect(MocketSocketIo.prototype.to).toHaveBeenCalledTimes(1);
        expect(MocketSocketIo.prototype.to).toHaveBeenCalledWith(
          TestCase.positive.update.expected.chat,
        );
        expect(MocketSocketIo.prototype.emit).toHaveBeenCalledTimes(1);
        expect(MocketSocketIo.prototype.emit).toHaveBeenCalledWith(
          'message_updated',
          TestCase.positive.update.expected,
        );
      });
    });

    describe('handleReadMessage', () => {
      it('should be called handleReadMessage', async () => {
        jest
          .spyOn(mockMessageService, 'readMessage')
          .mockResolvedValueOnce(TestCase.positive.update.expected);
        const read = await chatGateway.handleReadMessage(
          TestCase.positive.update.input.id,
          socket as unknown as SocketIO,
        );
        expect(read).toBe(true);
        expect(mockMessageService.readMessage).toHaveBeenCalledTimes(1);
        expect(mockMessageService.readMessage).toHaveBeenCalledWith(
          TestCase.positive.update.input.id,
          [new Types.ObjectId(socket.user.id)],
        );
      });
    });

    describe('handleSendMessage', () => {
      it('should be called handleSendMessage', async () => {
        const sendMessageDto: SendMessageDto = new SendMessageDto();
        Object.assign(sendMessageDto, TestCase.positive.sendMessage.input);
        jest
          .spyOn(mockChatService, 'sendMessage')
          .mockResolvedValueOnce(TestCase.positive.sendMessage.expected);
        jest
          .spyOn(mockMessageService, 'deliveredMessage')
          .mockResolvedValueOnce(TestCase.positive.update.expected);
        jest
          .spyOn(mockSocketService, 'findAllByUserId')
          .mockResolvedValueOnce(TestCase.positive.sendMessage.socketFromDb);
        jest
          .spyOn(MockedServerIo.prototype, 'fetchSockets')
          .mockResolvedValueOnce([
            TestCase.positive.sendMessage.sockets[0],
          ] as never);

        const send = await chatGateway.handleSendMessage(
          sendMessageDto,
          socket as unknown as SocketIO,
        );
        expect(send).toBe(true);
        expect(MocketSocketIo.prototype.to).toHaveBeenCalledTimes(1);
        expect(MocketSocketIo.prototype.to).toHaveBeenCalledWith(
          TestCase.positive.sendMessage.expected.chat.id,
        );
        expect(MocketSocketIo.prototype.emit).toHaveBeenCalledTimes(1);
        expect(MocketSocketIo.prototype.emit).toHaveBeenCalledWith(
          'receive_message',
          TestCase.positive.sendMessage.expected.message,
        );
        expect(mockChatService.sendMessage).toHaveBeenCalledTimes(1);
        expect(mockChatService.sendMessage).toHaveBeenCalledWith(
          sendMessageDto,
          new Types.ObjectId(socket.user.id),
        );
      });

      it('should be called handleSendMessage', async () => {
        const sendMessageDto: SendMessageDto = new SendMessageDto();
        Object.assign(sendMessageDto, TestCase.positive.sendMessage.input);
        jest.spyOn(mockChatService, 'sendMessage').mockResolvedValueOnce({
          ...TestCase.positive.sendMessage.expected,
          chat: {
            id: '123455666',
            participants: [
              '665ad6de39eaf3baf42579c1',
              '265ad6de39eaf3ssfafaf42579e9a',
            ],
          },
        });
        jest
          .spyOn(mockMessageService, 'deliveredMessage')
          .mockResolvedValueOnce(TestCase.positive.update.expected);
        jest
          .spyOn(mockSocketService, 'findAllByUserId')
          .mockResolvedValueOnce(TestCase.positive.sendMessage.socketFromDb);
        jest
          .spyOn(MockedServerIo.prototype, 'fetchSockets')
          .mockResolvedValueOnce([
            TestCase.positive.sendMessage.sockets[0],
          ] as never);

        const send = await chatGateway.handleSendMessage(
          sendMessageDto,
          socket as unknown as SocketIO,
        );
        expect(send).toBe(true);
        expect(MocketSocketIo.prototype.to).toHaveBeenCalledTimes(1);
        expect(MocketSocketIo.prototype.to).toHaveBeenCalledWith(
          TestCase.positive.sendMessage.expected.chat.id,
        );
        expect(MocketSocketIo.prototype.emit).toHaveBeenCalledTimes(1);
        expect(MocketSocketIo.prototype.emit).toHaveBeenCalledWith(
          'receive_message',
          TestCase.positive.sendMessage.expected.message,
        );
        expect(mockChatService.sendMessage).toHaveBeenCalledTimes(1);
        expect(mockChatService.sendMessage).toHaveBeenCalledWith(
          sendMessageDto,
          new Types.ObjectId(socket.user.id),
        );
      });
    });
  });

  describe('Negative Test Case', () => {
    describe('handleConnection', () => {
      it('should be called handleConnection', async () => {
        const error = new Error(`mongodb error`);
        jest.spyOn(mockSocketService, 'create').mockRejectedValueOnce(error);

        try {
          await chatGateway.handleConnection(socket as unknown as SocketIO);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('handleDisconnect', () => {
      it('should be called handleDisconnect', async () => {
        const error = new Error(`mongodb error`);
        jest
          .spyOn(mockSocketService, 'destroyBySocketId')
          .mockRejectedValueOnce(error);

        try {
          await chatGateway.handleDisconnect(socket as unknown as SocketIO);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('handleJoinRoom', () => {
      it('should be called handleJoinRoom', async () => {
        const error = new Error(`mongodb error`);
        const chat_id = '12344555';
        const joinRoomDto: JoinChatRoomDto = new JoinChatRoomDto();
        Object.assign(joinRoomDto, { chat_id });

        jest
          .spyOn(MocketSocketIo.prototype, 'join')
          .mockImplementationOnce(() => {
            throw error;
          });
        try {
          await chatGateway.handleJoinRoom(
            joinRoomDto,
            socket as unknown as SocketIO,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('handleUpdateMessage', () => {
      it('should be called handleUpdateMessage', async () => {
        const error = new Error(`error mongodb`);
        const updateMessageDto: WebsocketUpdateMessageDto =
          new WebsocketUpdateMessageDto();
        Object.assign(updateMessageDto, {
          ...TestCase.positive.update.input,
          message_id: TestCase.positive.update.input.id,
        });

        jest.spyOn(MocketSocketIo.prototype, 'to');
        jest.spyOn(MocketSocketIo.prototype, 'emit');
        jest.spyOn(mockMessageService, 'update').mockRejectedValueOnce(error);

        try {
          await chatGateway.handleUpdateMessage(
            updateMessageDto,
            socket as unknown as SocketIO,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('handleReadMessage', () => {
      it('should be called handleReadMessage', async () => {
        const error = new Error(`error mongodb`);
        jest
          .spyOn(mockMessageService, 'readMessage')
          .mockRejectedValueOnce(error);

        try {
          await chatGateway.handleReadMessage(
            TestCase.positive.update.input.id,
            socket as unknown as SocketIO,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('handleSendMessage', () => {
      it('should be called handleSendMessage', async () => {
        const error = new Error(`error mongodb`);
        const sendMessageDto: SendMessageDto = new SendMessageDto();
        Object.assign(sendMessageDto, TestCase.positive.sendMessage.input);
        jest.spyOn(mockChatService, 'sendMessage').mockRejectedValueOnce(error);

        try {
          await chatGateway.handleSendMessage(
            sendMessageDto,
            socket as unknown as SocketIO,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('notifyToAllNotInRoom', () => {
      it('should be called notifyToAllNotInRoom', async () => {
        const error = new Error(`error emit`);
        jest
          .spyOn(MockedServerIo.prototype, 'to')
          .mockImplementationOnce(() => {
            throw error;
          });

        try {
          await chatGateway.notifyToAllNotInRoom(['a'], 'a');
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });
  });
});
