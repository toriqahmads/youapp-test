import { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from '../service/message.service';
import { UpdateMessageDto } from '../dto/message/update.message.dto';
import { FindallMessageDto } from '../dto/message/findall.message.dto';
import { MessageType } from 'src/shared/enum/message.enum';

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
    findOne: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
      },
    },
    destroy: {
      input: {
        id: '265ad6de39eaf3baf42579e9a',
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
      },
      expected: {
        id: '265ad6de39eaf3baf42579e9a',
        body: 'text message',
        type: MessageType.TEXT,
        reply_for_message: '165ad6de39eaf3baf42579e9',
        attachments: ['http://localhost.com/a'],
        reads: [
          {
            by: sender,
            time: new Date(),
          },
        ],
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
            sender: sender,
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

describe('MessageController Testing', () => {
  let messageController: MessageController;
  const mockMessageService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findMyMessages: jest.fn(),
    readMessage: jest.fn(),
  };

  const req = {
    user: {
      id: '665ad6de39eaf3baf42579c1',
      email: 'test@gmail.com',
      messagename: 'test',
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        MessageController,
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    messageController = app.get<MessageController>(MessageController);
  });

  describe('MessageController', () => {
    it('should be defined', () => {
      expect(messageController).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('update', () => {
      it('should update a existing message', async () => {
        const updateMessage: UpdateMessageDto = new UpdateMessageDto();
        Object.assign(updateMessage, TestCase.positive.update.input);
        jest
          .spyOn(mockMessageService, 'update')
          .mockResolvedValueOnce(TestCase.positive.update.expected);

        const updatedMessage = await messageController.update(
          TestCase.positive.update.input.id,
          updateMessage,
        );
        expect(updatedMessage.id).toBe(TestCase.positive.update.expected.id);
        expect(updatedMessage.body).toBe(
          TestCase.positive.update.expected.body,
        );
        expect(updatedMessage.attachments).toBe(
          TestCase.positive.update.expected.attachments,
        );
      });
    });

    describe('findOne', () => {
      it('should findOne a existing message', async () => {
        jest
          .spyOn(mockMessageService, 'findOne')
          .mockResolvedValueOnce(TestCase.positive.findOne.expected);

        const message = await messageController.findOne(
          TestCase.positive.findOne.input.id,
        );
        expect(message.id).toBe(TestCase.positive.findOne.expected.id);
        expect(message.body).toBe(TestCase.positive.findOne.expected.body);
      });
    });

    describe('findAllMyMessages', () => {
      it('should findAll a existing message', async () => {
        const findAllMessage: FindallMessageDto = new FindallMessageDto();
        Object.assign(findAllMessage, TestCase.positive.findAll.input);
        jest
          .spyOn(mockMessageService, 'findMyMessages')
          .mockResolvedValueOnce(TestCase.positive.findAll.expected);

        const messages = await messageController.findAllMyMessages(
          findAllMessage,
          req,
        );
        expect(messages.list.length).toBe(1);
        expect(messages.list[0].id).toBe(
          TestCase.positive.findAll.expected.list[0].id,
        );
        expect(messages.list[0].body).toBe(
          TestCase.positive.findAll.expected.list[0].body,
        );
        expect(messages.list[0].sender).toBe(
          TestCase.positive.findAll.expected.list[0].sender,
        );
      });
    });

    describe('readMessage', () => {
      it('should readMessage a existing message', async () => {
        jest
          .spyOn(mockMessageService, 'readMessage')
          .mockResolvedValueOnce(TestCase.positive.readMessage.expected);

        const message = await messageController.readMessage(
          TestCase.positive.readMessage.input.id,
          req,
        );
        expect(message.id).toBe(TestCase.positive.readMessage.expected.id);
        expect(message.body).toBe(TestCase.positive.readMessage.expected.body);
        expect(message.reads.length).toBe(
          TestCase.positive.readMessage.expected.reads.length,
        );
      });
    });

    describe('destroy', () => {
      it('should destroy a existing message', async () => {
        jest
          .spyOn(mockMessageService, 'destroy')
          .mockResolvedValueOnce(TestCase.positive.destroy.expected);

        const message = await messageController.destroy(
          TestCase.positive.destroy.input.id,
        );
        expect(message.id).toBe(TestCase.positive.destroy.expected.id);
        expect(message.body).toBe(TestCase.positive.destroy.expected.body);
      });
    });
  });
});
