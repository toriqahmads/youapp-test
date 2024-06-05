import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AuthService } from './auth/service/auth.service';
import { UserService } from './user/service/user.service';
import { ChatService } from './chat/service/chat.service';
import { MessageService } from './chat/service/message.service';
import { RegisterDto } from './auth/dto/register';
import { LoginDto } from './auth/dto/login.dto';
import { Gender } from './shared/enum/gender.enum';
import { Horoscope } from './shared/enum/horoscope.enum';
import { Zodiac } from './shared/enum/zodiac.enum';
import { UpsertProfileUserDto } from './user/dto/upsert.profile.dto';
import { Readable } from 'stream';
import { MessageType } from './shared/enum/message.enum';
import { SendMessageDto } from './chat/dto/chat/send.message.dto';
import { FindallChatDto } from './chat/dto/chat/findall.chat.dto';
import { FindallMessageDto } from './chat/dto/message/findall.message.dto';

const req = {
  user: {
    id: '665ad6de39eaf3baf42579c1',
    email: 'test@gmail.com',
    authname: 'test',
  },
};

const message = {
  id: '165ad6de39eaf3baf42579e9',
  chat: '265ad6de39eaf3baf42577f',
  body: 'text message',
  type: MessageType.TEXT,
  reply_for_message: '165ad6de39eaf3baf42579e9',
  attachments: ['http://localhost.com/a'],
};

const TestCase = {
  positive: {
    register: {
      input: {
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
      },
    },
    login: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: {
        user: {
          id: '665ad6de39eaf3baf42579c1',
          email: 'test@gmail.com',
          username: 'test',
        },
        access_token: 'access',
        refresh_token: 'refresh',
      },
    },
    createProfile: {
      input: {
        display_name: 'Toriq Ahmad',
        birthday: '1997-06-02',
        gender: Gender.MALE,
        height: 170,
        weight: 60,
        interests: ['program'],
      },
      expected: {
        display_name: 'Toriq Ahmad',
        birthday: '1997-06-02',
        gender: Gender.MALE,
        horoscope: Horoscope.GEMINI,
        zodiac: Zodiac.OX,
        height: 170,
        weight: 60,
        interests: ['program'],
      },
    },
    updateProfile: {
      input: req,
      expected: {
        display_name: 'Toriq Ahmad',
        birthday: '1997-06-02',
        gender: Gender.MALE,
        horoscope: Horoscope.GEMINI,
        zodiac: Zodiac.OX,
        height: 170,
        weight: 60,
        interests: ['program'],
      },
    },
    getProfile: {
      input: req,
      expected: {
        user: {
          id: '665ad6de39eaf3baf42579c1',
          email: 'test@gmail.com',
          username: 'test',
          profile: {
            display_name: 'Toriq Ahmad',
            birthday: '1997-06-02',
            gender: Gender.MALE,
            horoscope: Horoscope.GEMINI,
            zodiac: Zodiac.OX,
            cover: `/banner/test.jpg`,
            height: 170,
            weight: 60,
            interests: ['program'],
          },
        },
      },
    },
    viewChat: {
      input: {
        chat_name: 'test',
        recipient_id: '265ad6de39eaf3baf42577f',
        is_group: false,
        participants: ['165ad6de39eaf3baf42579e9'],
      },
      expected: {
        list: [
          {
            id: '265ad6de39eaf3baf42579e9a',
            participants: [
              '165ad6de39eaf3baf42579e9',
              '265ad6de39eaf3baf42577f',
            ],
            chat_name: 'test',
            is_group: false,
          },
        ],
        pagination: {
          total_data: 1,
          per_page: 1,
          total_page: 1,
          current_page: 1,
          next_page: null,
          prev_page: null,
        },
      },
    },
    sendMessage: {
      input: {
        participants: ['165ad6de39eaf3baf42579e9', '665ad6de39eaf3baf42579c1'],
        chat_name: 'test',
        is_group: false,
        recipient: '165ad6de39eaf3baf42579e9',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
      expected: {
        chat: {
          id: '265ad6de39eaf3baf42579e9a',
          participants: [
            '165ad6de39eaf3baf42579e9',
            '665ad6de39eaf3baf42579c1',
          ],
          chat_name: 'test',
          is_group: false,
        },
        message,
      },
    },
    viewMessage: {
      input: {
        chat_id: '665ad6de39eaf3baf42579c1',
        message: 'bbbbcccccddddd',
        from: '665ad6de39eaf3baf42579c1',
      },
      expected: {
        list: [
          {
            id: '165ad6de39eaf3baf42579e9',
            chat: '265ad6de39eaf3baf42577f',
            body: 'text message',
            type: MessageType.TEXT,
            reply_for_message: '165ad6de39eaf3baf42579e9',
            attachments: ['http://localhost.com/a'],
            sender: req,
          },
        ],
        pagination: {
          total_data: 1,
          per_page: 1,
          total_page: 1,
          current_page: 1,
          next_page: null,
          prev_page: null,
        },
      },
    },
  },
};

describe('AppController', () => {
  let appController: AppController;

  const mockMessageService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findMyMessages: jest.fn(),
    readMessage: jest.fn(),
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

  const mockUserService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    upsertProfile: jest.fn(),
    findByUsernameOrEmail: jest.fn(),
    findByEmail: jest.fn(),
    findByIdWithFullDetail: jest.fn(),
    isUsernameDuplicate: jest.fn(),
    isEmailDuplicate: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('Positive Test Case', () => {
    describe('healthCheck', () => {
      it('should return "ok"', () => {
        expect(appController.healthCheck()).toBe('ok');
      });
    });

    describe('register', () => {
      it('should register', async () => {
        const registerDto: RegisterDto = new RegisterDto();
        Object.assign(registerDto, TestCase.positive.register.input);
        jest
          .spyOn(mockAuthService, 'register')
          .mockResolvedValueOnce(TestCase.positive.register.expected);

        const user = await appController.register(
          TestCase.positive.register.input,
        );
        expect(user.id).toBe(TestCase.positive.register.expected.id);
        expect(user.email).toBe(TestCase.positive.register.expected.email);
        expect(user.username).toBe(
          TestCase.positive.register.expected.username,
        );
      });
    });

    describe('login', () => {
      it('should login', async () => {
        const loginDto: LoginDto = new LoginDto();
        Object.assign(loginDto, {
          username_or_email: 'test',
          password: 'test',
        });
        jest
          .spyOn(mockAuthService, 'login')
          .mockResolvedValueOnce(TestCase.positive.login.expected);

        const auth = await appController.login(req);
        expect(auth.user).toEqual(TestCase.positive.login.expected.user);
      });
    });

    it('should createProfile with cover for existing user', async () => {
      const filename = 'test.jpg';
      const createProfile = new UpsertProfileUserDto();
      Object.assign(createProfile, TestCase.positive.createProfile.input);
      jest.spyOn(mockUserService, 'upsertProfile').mockResolvedValueOnce({
        ...TestCase.positive.createProfile.expected,
        cover: `/banner/${filename}`,
        gender: Gender.FEMALE,
      });

      const user = await appController.createProfile(req, createProfile, {
        filename,
        fieldname: 'banner',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable(),
        destination: '',
        path: '',
        buffer: undefined,
      });
      expect(user.horoscope).toBe(
        TestCase.positive.createProfile.expected.horoscope,
      );
      expect(user.birthday).toBe(
        TestCase.positive.createProfile.expected.birthday,
      );
      expect(user.zodiac).toBe(TestCase.positive.createProfile.expected.zodiac);
      expect(user.cover).toBe(`/banner/${filename}`);
    });

    it('should updateProfile with cover for existing user', async () => {
      const filename = 'test.jpg';
      const updateProfile = new UpsertProfileUserDto();
      Object.assign(updateProfile, TestCase.positive.updateProfile.input);
      jest.spyOn(mockUserService, 'upsertProfile').mockResolvedValueOnce({
        ...TestCase.positive.updateProfile.expected,
        cover: `/banner/${filename}`,
        gender: Gender.FEMALE,
      });

      const user = await appController.updateProfile(req, updateProfile, {
        filename,
        fieldname: 'banner',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: new Readable(),
        destination: '',
        path: '',
        buffer: undefined,
      });
      expect(user.horoscope).toBe(
        TestCase.positive.updateProfile.expected.horoscope,
      );
      expect(user.birthday).toBe(
        TestCase.positive.updateProfile.expected.birthday,
      );
      expect(user.zodiac).toBe(TestCase.positive.updateProfile.expected.zodiac);
      expect(user.cover).toBe(`/banner/${filename}`);
    });

    it('should getProfile with cover for existing user', async () => {
      jest
        .spyOn(mockUserService, 'findByIdWithFullDetail')
        .mockResolvedValueOnce(TestCase.positive.getProfile.expected);

      const user = await appController.getProfile(req);
      expect(user).toEqual(TestCase.positive.getProfile.expected);
    });

    describe('sendMessage', () => {
      it('should sendMessage', async () => {
        const updateChat: SendMessageDto = new SendMessageDto();
        Object.assign(updateChat, TestCase.positive.sendMessage.input);
        jest
          .spyOn(mockChatService, 'sendMessage')
          .mockResolvedValueOnce(TestCase.positive.sendMessage.expected);

        const updatedChat = await appController.sendMessage(
          TestCase.positive.sendMessage.input,
          req,
        );
        expect(updatedChat.chat.id).toBe(
          TestCase.positive.sendMessage.expected.chat.id,
        );
        expect(updatedChat.message.body).toBe(
          TestCase.positive.sendMessage.expected.message.body,
        );
        expect(updatedChat.message.attachments).toBe(
          TestCase.positive.sendMessage.expected.message.attachments,
        );
      });
    });

    describe('viewChat', () => {
      it('should viewChat a existing chat', async () => {
        const findAllChat: FindallChatDto = new FindallChatDto();
        Object.assign(findAllChat, TestCase.positive.viewChat.input);
        jest
          .spyOn(mockChatService, 'findMyChats')
          .mockResolvedValueOnce(TestCase.positive.viewChat.expected);

        const chats = await appController.viewChats(findAllChat, req);
        expect(chats.list.length).toBe(1);
        expect(chats.list[0].id).toBe(
          TestCase.positive.viewChat.expected.list[0].id,
        );
      });
    });

    describe('viewMessage', () => {
      it('should viewMessage a existing message', async () => {
        const findAllMessage: FindallMessageDto = new FindallMessageDto();
        Object.assign(findAllMessage, TestCase.positive.viewMessage.input);
        jest
          .spyOn(mockMessageService, 'findMyMessages')
          .mockResolvedValueOnce(TestCase.positive.viewMessage.expected);

        const messages = await appController.viewMessages(findAllMessage, req);
        expect(messages.list.length).toBe(1);
        expect(messages.list[0].id).toBe(
          TestCase.positive.viewMessage.expected.list[0].id,
        );
        expect(messages.list[0].body).toBe(
          TestCase.positive.viewMessage.expected.list[0].body,
        );
        expect(messages.list[0].sender).toBe(
          TestCase.positive.viewMessage.expected.list[0].sender,
        );
      });
    });
  });
});
