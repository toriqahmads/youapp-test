import { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MessageService } from './message.service';
import { Message } from 'src/shared/schema/message.schema';
import { CreateMessageDto } from '../dto/message/create.message.dto';
import { UpdateMessageDto } from '../dto/message/update.message.dto';
import { FindallMessageDto } from '../dto/message/findall.message.dto';
import { MessageType } from 'src/shared/enum/message.enum';
import { NotFoundException } from '@nestjs/common';
import { WebsocketUpdateMessageDto } from '../dto/message/websocket.update.message.dto';

const sender = new Types.ObjectId('665ad6de39eaf3baf42579c1');
const TestCase = {
  positive: {
    create: {
      input: {
        chat_id: '265ad6de39eaf3baf42577f',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
      expected: {
        chat_id: '265ad6de39eaf3baf42577f',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
    },
    update: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
    },
    readMessage: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
        reads_by: [new Types.ObjectId('165ad6de39eaf3baf42579e9')],
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        reads: [
          {
            by: new Types.ObjectId('165ad6de39eaf3baf42579e9'),
            time: new Date(),
          },
        ],
      },
    },
    deliveredMessage: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
        delivereds_by: [new Types.ObjectId('165ad6de39eaf3baf42579e9')],
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        delivereds: [
          {
            by: new Types.ObjectId('165ad6de39eaf3baf42579e9'),
            time: new Date(),
          },
        ],
      },
    },
    destroy: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
      },
      expected: {
        id: '165ad6de39eaf3baf42579e9',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
    },
    findOne: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
      },
      expected: {
        id: '165ad6de39eaf3baf42579e9',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
    },
    findAll: {
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
        chat_id: '265ad6de39eaf3baf42577f',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
      expected: new Error(`error mongodb`),
    },
    update: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
      },
      expected: new NotFoundException(
        `message with id 165ad6de39eaf3baf42579e9 is not found`,
      ),
    },
    readMessage: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
        reads_by: [new Types.ObjectId('165ad6de39eaf3baf42579e9')],
      },
      expected: new NotFoundException(
        `message with id 265ad6de39eaf3baf42579e9a is not found`,
      ),
    },
    deliveredMessage: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
        delivereds_by: [new Types.ObjectId('165ad6de39eaf3baf42579e9')],
      },
      expected: new NotFoundException(
        `message with id 265ad6de39eaf3baf42579e9a is not found`,
      ),
    },
    destroy: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
      },
      expected: new NotFoundException(
        `message with id 165ad6de39eaf3baf42579e9 is not found`,
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
        message: 'bbbbcccccddddd',
        from: '665ad6de39eaf3baf42579c1',
      },
      expected: new Error('Method not implemented.'),
    },
    findMyMessages: {
      input: {
        chat_id: '665ad6de39eaf3baf42579c1',
        message: 'bbbbcccccddddd',
        from: '665ad6de39eaf3baf42579c1',
      },
      expected: new Error('Method not implemented.'),
    },
  },
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

class MockedMessageModel {
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

describe('Message Testing', () => {
  let messageService: MessageService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getModelToken(Message.name),
          useValue: MockedMessageModel,
        },
      ],
    }).compile();

    messageService = app.get<MessageService>(MessageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Message', () => {
    it('should be defined', () => {
      expect(messageService).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('create', () => {
      it('should create a new message user', async () => {
        const createMessage: CreateMessageDto = new CreateMessageDto();
        Object.assign(createMessage, {
          ...TestCase.positive.create.input,
          sender,
        });
        jest
          .spyOn(MockedMessageModel, 'create')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        const newMessage = await messageService.create(createMessage);
        expect(MockedMessageModel.create).toHaveBeenCalledTimes(1);
        expect(newMessage.body).toBe(TestCase.positive.create.expected.body);
      });
    });

    describe('update', () => {
      it('should update a existing message user', async () => {
        const updateMessage: UpdateMessageDto = new UpdateMessageDto();
        const webMessageMessage: WebsocketUpdateMessageDto =
          new WebsocketUpdateMessageDto();
        Object.assign(webMessageMessage, {
          ...TestCase.positive.update.input,
          message_id: TestCase.positive.update.input.id,
        });

        Object.assign(updateMessage, {
          ...TestCase.positive.update.input,
          type: MessageType.MARKDOWN,
        });
        jest
          .spyOn(MockedMessageModel, 'findById')
          .mockResolvedValueOnce(
            new MockedMessageModel(TestCase.positive.update.expected),
          );
        jest.spyOn(MockedMessageModel.prototype, 'save');

        const updatedMessage = await messageService.update(
          TestCase.positive.update.input.id,
          updateMessage,
        );
        expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedMessageModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(updatedMessage.id).toBe(TestCase.positive.update.expected.id);
        expect(updatedMessage.body).toBe(
          TestCase.positive.update.expected.body,
        );
        expect(updatedMessage.type).toBe(MessageType.MARKDOWN);
      });
    });

    describe('findMyMessages', () => {
      it('should findMyMessages message and return 1 message', async () => {
        const findAll: FindallMessageDto = new FindallMessageDto();
        Object.assign(findAll, TestCase.positive.findAll.input);
        jest
          .spyOn(MockedMessageModel, 'aggregate')
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

        const messages = await messageService.findMyMessages(findAll, sender);
        expect(MockedMessageModel.aggregate).toHaveBeenCalledTimes(2);
        expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.count).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(2);
        expect(messages.list.length).toBe(
          TestCase.positive.findAll.expected.list.length,
        );
        expect(messages.pagination.per_page).toBe(25);
        expect(messages.list[0].body).toBe(
          TestCase.positive.findAll.expected.list[0].body,
        );
      });

      it('should findMyMessages message and return 1 message', async () => {
        const findAll: FindallMessageDto = new FindallMessageDto();
        Object.assign(findAll, {
          ...TestCase.positive.findAll.input,
          page: 1,
          limit: 1,
        });
        jest
          .spyOn(MockedMessageModel, 'aggregate')
          .mockReturnValueOnce(new MockAggregate());
        jest.spyOn(MockAggregate.prototype, 'limit');
        jest.spyOn(MockAggregate.prototype, 'skip');
        jest
          .spyOn(MockAggregate.prototype, 'exec')
          .mockResolvedValueOnce([] as never);

        const messages = await messageService.findMyMessages(findAll, sender);
        expect(MockedMessageModel.aggregate).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(1);
        expect(messages.list.length).toBe(0);
        expect(messages.pagination.per_page).toBe(1);
      });
    });

    describe('readMessage', () => {
      it('should update read message a existing message user', async () => {
        jest
          .spyOn(MockedMessageModel, 'findById')
          .mockResolvedValueOnce(
            new MockedMessageModel(TestCase.positive.readMessage.expected),
          );
        jest.spyOn(MockedMessageModel.prototype, 'save');

        const updatedMessage = await messageService.readMessage(
          TestCase.positive.readMessage.input.id,
          TestCase.positive.readMessage.input.reads_by,
        );
        expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedMessageModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(updatedMessage.id).toBe(
          TestCase.positive.readMessage.expected.id,
        );
        expect(updatedMessage.reads.length).toBe(
          TestCase.positive.readMessage.expected.reads.length,
        );
      });
    });

    describe('deliveredMessage', () => {
      it('should update delivered message a existing message user', async () => {
        jest
          .spyOn(MockedMessageModel, 'findById')
          .mockResolvedValueOnce(
            new MockedMessageModel(TestCase.positive.deliveredMessage.expected),
          );
        jest.spyOn(MockedMessageModel.prototype, 'save');

        const updatedMessage = await messageService.deliveredMessage(
          TestCase.positive.deliveredMessage.input.id,
          TestCase.positive.deliveredMessage.input.delivereds_by,
        );
        expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedMessageModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(updatedMessage.id).toBe(
          TestCase.positive.deliveredMessage.expected.id,
        );
        expect(updatedMessage.delivereds.length).toBe(
          TestCase.positive.deliveredMessage.expected.delivereds.length,
        );
      });
    });

    describe('findOne', () => {
      it('should findOne a existing message user', async () => {
        jest
          .spyOn(MockedMessageModel, 'findById')
          .mockResolvedValueOnce(
            new MockedMessageModel(TestCase.positive.findOne.expected),
          );

        const message = await messageService.findOne(
          TestCase.positive.findOne.input.id,
        );
        expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
        expect(message.id).toBe(TestCase.positive.findOne.expected.id);
      });
    });

    describe('destroy', () => {
      it('should destroy a existing message user', async () => {
        jest
          .spyOn(MockedMessageModel, 'findById')
          .mockResolvedValueOnce(
            new MockedMessageModel(TestCase.positive.destroy.expected),
          );

        const message = await messageService.destroy(
          TestCase.positive.destroy.input.id,
        );
        expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedMessageModel.findById).toHaveBeenCalledWith(
          TestCase.positive.destroy.input.id,
        );
        expect(message.id).toBe(TestCase.positive.destroy.expected.id);
      });
    });
  });

  describe('Negative Test Case', () => {
    describe('create', () => {
      it('should create message but throw error', async () => {
        const createMessage: CreateMessageDto = new CreateMessageDto();
        Object.assign(createMessage, TestCase.negative.create.input);
        jest
          .spyOn(MockedMessageModel, 'create')
          .mockRejectedValueOnce(TestCase.negative.create.expected);

        try {
          await messageService.create(createMessage);
        } catch (err) {
          expect(MockedMessageModel.create).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.create.expected);
        }
      });
    });

    describe('update', () => {
      it('should update message but throw error', async () => {
        const updateMessage: UpdateMessageDto = new UpdateMessageDto();
        Object.assign(updateMessage, TestCase.negative.update.input);
        jest.spyOn(MockedMessageModel, 'findById').mockResolvedValueOnce(null);

        try {
          await messageService.update(
            TestCase.negative.update.input.id,
            updateMessage,
          );
        } catch (err) {
          expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.update.expected);
        }
      });
    });

    describe('readMessage', () => {
      it('should readMessage message but throw error', async () => {
        jest.spyOn(MockedMessageModel, 'findById').mockResolvedValueOnce(null);

        try {
          await messageService.readMessage(
            TestCase.negative.readMessage.input.id,
            TestCase.negative.readMessage.input.reads_by,
          );
        } catch (err) {
          expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.readMessage.expected);
        }
      });
    });

    describe('deliveredMessage', () => {
      it('should deliveredMessage message but throw error', async () => {
        jest.spyOn(MockedMessageModel, 'findById').mockResolvedValueOnce(null);

        try {
          await messageService.deliveredMessage(
            TestCase.negative.deliveredMessage.input.id,
            TestCase.negative.deliveredMessage.input.delivereds_by,
          );
        } catch (err) {
          expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.deliveredMessage.expected);
        }
      });
    });

    describe('findOne', () => {
      it('should findOne message but throw error', async () => {
        jest
          .spyOn(MockedMessageModel, 'findById')
          .mockRejectedValueOnce(TestCase.negative.findOne.expected);

        try {
          await messageService.findOne(TestCase.negative.findOne.input.id);
        } catch (err) {
          expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findOne.expected);
        }
      });
    });

    describe('destroy', () => {
      it('should destroy message but throw error', async () => {
        jest.spyOn(MockedMessageModel, 'findById').mockResolvedValueOnce(null);

        try {
          await messageService.destroy(TestCase.negative.destroy.input.id);
        } catch (err) {
          expect(MockedMessageModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.destroy.expected);
        }
      });
    });

    describe('findAll', () => {
      it('should findAll message but throw error', async () => {
        try {
          const findAll: FindallMessageDto = new FindallMessageDto();
          Object.assign(findAll, TestCase.negative.findAll.input);
          await messageService.findAll(findAll);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findAll.expected);
        }
      });
    });

    it('should findMyMessages message and return 1 message', async () => {
      const error = new Error(`mongodb error`);
      const findAll: FindallMessageDto = new FindallMessageDto();
      Object.assign(findAll, {
        ...TestCase.positive.findAll.input,
        page: 1,
        limit: 1,
      });
      jest
        .spyOn(MockedMessageModel, 'aggregate')
        .mockReturnValueOnce(new MockAggregate());
      jest.spyOn(MockAggregate.prototype, 'limit');
      jest.spyOn(MockAggregate.prototype, 'skip');
      jest
        .spyOn(MockAggregate.prototype, 'exec')
        .mockRejectedValueOnce(error as never);

      try {
        await messageService.findMyMessages(findAll, sender);
      } catch (err) {
        expect(MockedMessageModel.aggregate).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
        expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(Error);
        expect(err).toEqual(error);
      }
    });
  });
});
