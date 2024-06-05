import { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { Chat } from 'src/shared/schema/chat.schema';
import { CreateChatDto } from '../dto/chat/create.chat.dto';
import { UpdateChatDto } from '../dto/chat/update.chat.dto';
import { FindallChatDto } from '../dto/chat/findall.chat.dto';
import { NotFoundException } from '@nestjs/common';
import { MessageType } from 'src/shared/enum/message.enum';
import { UserService } from 'src/user/service/user.service';
import { MessageService } from './message.service';
import { SendMessageDto } from '../dto/chat/send.message.dto';

const sender = new Types.ObjectId('665ad6de39eaf3baf42579c1');
const user = {
  id: '165ad6de39eaf3baf42579e9',
  email: 'test2@gmail.com',
  username: 'test2',
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
    create: {
      input: {
        participants: ['165ad6de39eaf3baf42579e9', '265ad6de39eaf3baf42577f'],
        chat_name: 'test',
        is_group: false,
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        participants: ['165ad6de39eaf3baf42579e9', '265ad6de39eaf3baf42577f'],
        chat_name: 'test',
        is_group: false,
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
    update: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
        participants: ['165ad6de39eaf3baf42579e9', '265ad6de39eaf3baf42577f'],
        chat_name: 'test',
        is_group: false,
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        participants: ['165ad6de39eaf3baf42579e9', '265ad6de39eaf3baf42577f'],
        chat_name: 'test',
        is_group: false,
      },
    },
    destroy: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        participants: ['165ad6de39eaf3baf42579e9', '265ad6de39eaf3baf42577f'],
        chat_name: 'test',
        is_group: false,
      },
    },
    findOne: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        participants: ['165ad6de39eaf3baf42579e9', '265ad6de39eaf3baf42577f'],
        chat_name: 'test',
        is_group: false,
      },
    },
    findAll: {
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
  },
  negative: {
    create: {
      input: {
        participants: ['165ad6de39eaf3baf42579e9', '265ad6de39eaf3baf42577f'],
        chat_name: 'test',
        is_group: false,
      },
      expected: new Error(`error mongodb`),
    },
    update: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
      },
      expected: new NotFoundException(
        `chat with id 165ad6de39eaf3baf42579e9 is not found`,
      ),
    },
    destroy: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
      },
      expected: new NotFoundException(
        `chat with id 165ad6de39eaf3baf42579e9 is not found`,
      ),
    },
    findOne: {
      input: {
        id: '665ad6de39eaf3baf42579c2',
      },
      expected: new Error(`error mongodb`),
    },
    findAll: {
      input: {
        chat_id: '665ad6de39eaf3baf42579c1',
        chat: 'bbbbcccccddddd',
        from: '665ad6de39eaf3baf42579c1',
      },
      expected: new Error('Method not implemented.'),
    },
    findMyChats: {
      input: {
        chat_id: '665ad6de39eaf3baf42579c1',
        chat: 'bbbbcccccddddd',
        from: '665ad6de39eaf3baf42579c1',
      },
      expected: new Error('Method not implemented.'),
    },
  },
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

const mockMessageService = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  destroy: jest.fn(),
  findMyMessages: jest.fn(),
};

class MockAggregate {
  exec() {
    return jest.fn();
  }
  limit() {
    return this;
  }
  skip() {
    return this;
  }
  count() {
    return this;
  }
}

class MockedChatModel {
  constructor(properties) {
    Object.assign(this, properties);
  }
  save() {
    return jest.fn();
  }
  deleteOne() {
    return jest.fn();
  }
  static save = jest.fn();
  static find = jest.fn();
  static create = jest.fn();
  static findOne = jest.fn();
  static updateOne = jest.fn();
  static findById = jest.fn();
  static countDocuments = jest.fn();
  static deleteOne = jest.fn();
  static aggregate = jest.fn().mockReturnValueOnce(new MockAggregate());
}

describe('Chat Testing', () => {
  let chatService: ChatService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
          useValue: MockedChatModel,
        },
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    chatService = app.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Chat', () => {
    it('should be defined', () => {
      expect(chatService).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('create', () => {
      it('should create a new chat user', async () => {
        const createChat: CreateChatDto = new CreateChatDto();
        Object.assign(createChat, {
          ...TestCase.positive.create.input,
          sender,
        });
        jest
          .spyOn(MockedChatModel, 'create')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        const newChat = await chatService.create(createChat);
        expect(MockedChatModel.create).toHaveBeenCalledTimes(1);
        expect(newChat.participants.length).toBe(
          TestCase.positive.create.expected.participants.length,
        );
      });
    });

    describe('sendMessage', () => {
      it('should sendMessage use existing chat', async () => {
        const createChat: SendMessageDto = new SendMessageDto();
        Object.assign(createChat, {
          ...TestCase.positive.create.input,
          sender,
        });
        jest.spyOn(mockUserService, 'findOne').mockResolvedValueOnce(user);
        jest.spyOn(mockMessageService, 'create').mockResolvedValueOnce(message);
        jest
          .spyOn(MockedChatModel, 'findOne')
          .mockResolvedValueOnce(TestCase.positive.findOne.expected);
        jest
          .spyOn(MockedChatModel, 'create')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        await chatService.sendMessage(createChat, sender);
        expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
        expect(mockMessageService.create).toHaveBeenCalledTimes(1);
      });

      it('should sendMessage create new chat', async () => {
        const createChat: SendMessageDto = new SendMessageDto();
        Object.assign(createChat, {
          ...TestCase.positive.create.input,
          sender,
        });
        jest.spyOn(mockUserService, 'findOne').mockResolvedValueOnce(user);
        jest.spyOn(mockMessageService, 'create').mockResolvedValueOnce(message);
        jest.spyOn(MockedChatModel, 'findOne').mockResolvedValueOnce(null);
        jest
          .spyOn(MockedChatModel, 'create')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        await chatService.sendMessage(createChat, sender);
        expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
        expect(mockMessageService.create).toHaveBeenCalledTimes(1);
        expect(MockedChatModel.create).toHaveBeenCalledTimes(1);
      });

      it('should sendMessage create new chat', async () => {
        const createChat: SendMessageDto = new SendMessageDto();
        Object.assign(createChat, {
          ...TestCase.positive.create.input,
          sender,
        });
        jest.spyOn(mockUserService, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(mockMessageService, 'create').mockResolvedValueOnce(message);
        jest.spyOn(MockedChatModel, 'findOne').mockResolvedValueOnce(null);
        jest
          .spyOn(MockedChatModel, 'create')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        await chatService.sendMessage(createChat, sender);
        expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
        expect(mockMessageService.create).toHaveBeenCalledTimes(1);
        expect(MockedChatModel.create).toHaveBeenCalledTimes(1);
      });
    });

    describe('update', () => {
      it('should update a existing chat user', async () => {
        const updateChat: UpdateChatDto = new UpdateChatDto();
        Object.assign(updateChat, TestCase.positive.update.input);
        jest
          .spyOn(MockedChatModel, 'findById')
          .mockResolvedValueOnce(
            new MockedChatModel(TestCase.positive.update.expected),
          );
        jest.spyOn(MockedChatModel.prototype, 'save');

        const updatedChat = await chatService.update(
          TestCase.positive.update.input.id,
          updateChat,
        );
        expect(MockedChatModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedChatModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(updatedChat.id).toBe(TestCase.positive.update.expected.id);
        expect(updatedChat.participants.length).toBe(
          TestCase.positive.update.expected.participants.length,
        );
      });
    });

    describe('findMyChats', () => {
      it('should findMyChats chat and return 1 chat', async () => {
        const findAll: FindallChatDto = new FindallChatDto();
        Object.assign(findAll, TestCase.positive.findAll.input);
        jest
          .spyOn(MockedChatModel, 'aggregate')
          .mockReturnValueOnce(new MockAggregate());
        jest.spyOn(MockAggregate.prototype, 'limit');
        jest.spyOn(MockAggregate.prototype, 'skip');
        jest.spyOn(MockAggregate.prototype, 'count');
        jest
          .spyOn(MockAggregate.prototype, 'exec')
          .mockResolvedValueOnce(
            TestCase.positive.findAll.expected.list as never,
          );
        jest
          .spyOn(MockAggregate.prototype, 'exec')
          .mockResolvedValueOnce([{ id: 1 }] as never);

        const chats = await chatService.findMyChats(findAll, sender);
        expect(MockedChatModel.aggregate).toHaveBeenCalledTimes(2);
        expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.count).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(2);
        expect(chats.list.length).toBe(
          TestCase.positive.findAll.expected.list.length,
        );
        expect(chats.pagination.per_page).toBe(25);
        expect(chats.list[0].chat_name).toBe(
          TestCase.positive.findAll.expected.list[0].chat_name,
        );
        expect(chats.list[0].participants[0]).toBe(
          TestCase.positive.findAll.expected.list[0].participants[0],
        );
      });

      it('should findMyChats chat and return 0 chat', async () => {
        const findAll: FindallChatDto = new FindallChatDto();
        Object.assign(findAll, {
          ...TestCase.positive.findAll.input,
          participants: '165ad6de39eaf3baf42579e9',
          page: 1,
          limit: 1,
        });
        jest
          .spyOn(MockedChatModel, 'aggregate')
          .mockReturnValueOnce(new MockAggregate());
        jest.spyOn(MockAggregate.prototype, 'limit');
        jest.spyOn(MockAggregate.prototype, 'skip');
        jest
          .spyOn(MockAggregate.prototype, 'exec')
          .mockResolvedValueOnce([] as never);

        const chats = await chatService.findMyChats(findAll, sender);
        expect(MockedChatModel.aggregate).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(1);
        expect(chats.list.length).toBe(0);
        expect(chats.pagination.per_page).toBe(1);
      });

      it('should findMyChats chat and return 0 chat', async () => {
        const findAll: FindallChatDto = new FindallChatDto();
        Object.assign(findAll, {
          ...TestCase.positive.findAll.input,
          page: 1,
          limit: 1,
        });

        delete findAll.participants;
        jest
          .spyOn(MockedChatModel, 'aggregate')
          .mockReturnValueOnce(new MockAggregate());
        jest.spyOn(MockAggregate.prototype, 'limit');
        jest.spyOn(MockAggregate.prototype, 'skip');
        jest
          .spyOn(MockAggregate.prototype, 'exec')
          .mockResolvedValueOnce([] as never);

        const chats = await chatService.findMyChats(findAll, sender);
        expect(MockedChatModel.aggregate).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(1);
        expect(chats.list.length).toBe(0);
        expect(chats.pagination.per_page).toBe(1);
      });
    });

    describe('findOne', () => {
      it('should findOne a existing chat user', async () => {
        jest
          .spyOn(MockedChatModel, 'findById')
          .mockResolvedValueOnce(
            new MockedChatModel(TestCase.positive.findOne.expected),
          );

        const chat = await chatService.findOne(
          TestCase.positive.findOne.input.id,
        );
        expect(MockedChatModel.findById).toHaveBeenCalledTimes(1);
        expect(chat.id).toBe(TestCase.positive.findOne.expected.id);
      });
    });

    describe('destroy', () => {
      it('should destroy a existing chat user', async () => {
        jest
          .spyOn(MockedChatModel, 'findById')
          .mockResolvedValueOnce(
            new MockedChatModel(TestCase.positive.destroy.expected),
          );

        const chat = await chatService.destroy(
          TestCase.positive.destroy.input.id,
        );
        expect(MockedChatModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedChatModel.findById).toHaveBeenCalledWith(
          TestCase.positive.destroy.input.id,
        );
        expect(chat.id).toBe(TestCase.positive.destroy.expected.id);
      });
    });
  });

  describe('Negative Test Case', () => {
    describe('create', () => {
      it('should create chat but throw error', async () => {
        const createChat: CreateChatDto = new CreateChatDto();
        Object.assign(createChat, TestCase.negative.create.input);
        jest
          .spyOn(MockedChatModel, 'create')
          .mockRejectedValueOnce(TestCase.negative.create.expected);

        try {
          await chatService.create(createChat);
        } catch (err) {
          expect(MockedChatModel.create).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.create.expected);
        }
      });

      it('should create chat but throw error', async () => {
        const createChat: CreateChatDto = new CreateChatDto();
        Object.assign(createChat, TestCase.negative.create.input);
        jest
          .spyOn(MockedChatModel, 'create')
          .mockRejectedValueOnce(TestCase.negative.create.expected);

        try {
          await chatService.create(createChat);
        } catch (err) {
          expect(MockedChatModel.create).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.create.expected);
        }
      });
    });

    describe('update', () => {
      it('should update chat but throw error', async () => {
        const updateChat: UpdateChatDto = new UpdateChatDto();
        Object.assign(updateChat, TestCase.negative.update.input);
        jest.spyOn(MockedChatModel, 'findById').mockResolvedValueOnce(null);

        try {
          await chatService.update(
            TestCase.negative.update.input.id,
            updateChat,
          );
        } catch (err) {
          expect(MockedChatModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.update.expected);
        }
      });
    });

    describe('findOne', () => {
      it('should findOne chat but throw error', async () => {
        jest
          .spyOn(MockedChatModel, 'findById')
          .mockRejectedValueOnce(TestCase.negative.findOne.expected);

        try {
          await chatService.findOne(TestCase.negative.findOne.input.id);
        } catch (err) {
          expect(MockedChatModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findOne.expected);
        }
      });
    });

    describe('destroy', () => {
      it('should destroy chat but throw error', async () => {
        jest.spyOn(MockedChatModel, 'findById').mockResolvedValueOnce(null);

        try {
          await chatService.destroy(TestCase.negative.destroy.input.id);
        } catch (err) {
          expect(MockedChatModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.destroy.expected);
        }
      });
    });

    describe('findAll', () => {
      it('should findAll chat but throw error', async () => {
        try {
          const findAll: FindallChatDto = new FindallChatDto();
          Object.assign(findAll, TestCase.negative.findAll.input);
          await chatService.findAll(findAll);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findAll.expected);
        }
      });
    });

    it('should findMyChats chat and return 1 chat', async () => {
      const error = new Error(`mongodb error`);
      const findAll: FindallChatDto = new FindallChatDto();
      Object.assign(findAll, {
        ...TestCase.positive.findAll.input,
        page: 1,
        limit: 1,
      });
      jest
        .spyOn(MockedChatModel, 'aggregate')
        .mockReturnValueOnce(new MockAggregate());
      jest.spyOn(MockAggregate.prototype, 'limit');
      jest.spyOn(MockAggregate.prototype, 'skip');
      jest
        .spyOn(MockAggregate.prototype, 'exec')
        .mockRejectedValueOnce(error as never);

      try {
        await chatService.findMyChats(findAll, sender);
      } catch (err) {
        expect(MockedChatModel.aggregate).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(Error);
        expect(err).toEqual(error);
      }
    });
  });

  describe('sendMessage', () => {
    it('should sendMessage throw error', async () => {
      const error = new Error(`user not found`);
      const createChat: SendMessageDto = new SendMessageDto();
      Object.assign(createChat, {
        ...TestCase.positive.create.input,
        sender,
      });
      jest.spyOn(mockUserService, 'findOne').mockRejectedValueOnce(error);

      try {
        await chatService.sendMessage(createChat, sender);
      } catch (err) {
        expect(mockUserService.findOne).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(Error);
        expect(err).toEqual(error);
      }
    });
  });

  describe('findChatForSendingMessage', () => {
    it('should findChatForSendingMessage throw error', async () => {
      const error = new Error(`user not found`);
      jest.spyOn(MockedChatModel, 'findOne').mockRejectedValueOnce(error);

      try {
        await chatService.findChatForSendingMessage(sender, sender);
      } catch (err) {
        expect(MockedChatModel.findOne).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(Error);
        expect(err).toEqual(error);
      }
    });
  });
});
