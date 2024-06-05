import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from '../service/chat.service';
import { FindallChatDto } from '../dto/chat/findall.chat.dto';
import { MessageType } from 'src/shared/enum/message.enum';
import { SendMessageDto } from '../dto/chat/send.message.dto';

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
};

describe('ChatController Testing', () => {
  let chatController: ChatController;
  const mockChatService = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
    findMyChats: jest.fn(),
    sendMessage: jest.fn(),
  };

  const req = {
    user: {
      id: '665ad6de39eaf3baf42579c1',
      email: 'test@gmail.com',
      chatname: 'test',
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ChatController,
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    chatController = app.get<ChatController>(ChatController);
  });

  describe('ChatController', () => {
    it('should be defined', () => {
      expect(chatController).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('sendMessage', () => {
      it('should sendMessage', async () => {
        const updateChat: SendMessageDto = new SendMessageDto();
        Object.assign(updateChat, TestCase.positive.sendMessage.input);
        jest
          .spyOn(mockChatService, 'sendMessage')
          .mockResolvedValueOnce(TestCase.positive.sendMessage.expected);

        const updatedChat = await chatController.sendMessage(
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

    describe('findOne', () => {
      it('should findOne a existing chat', async () => {
        jest
          .spyOn(mockChatService, 'findOne')
          .mockResolvedValueOnce(TestCase.positive.findOne.expected);

        const chat = await chatController.findOne(
          TestCase.positive.findOne.input.id,
        );
        expect(chat.id).toBe(TestCase.positive.findOne.expected.id);
      });
    });

    describe('findAllMyChats', () => {
      it('should findAll a existing chat', async () => {
        const findAllChat: FindallChatDto = new FindallChatDto();
        Object.assign(findAllChat, TestCase.positive.findAll.input);
        jest
          .spyOn(mockChatService, 'findMyChats')
          .mockResolvedValueOnce(TestCase.positive.findAll.expected);

        const chats = await chatController.findAllMyChat(findAllChat, req);
        expect(chats.list.length).toBe(1);
        expect(chats.list[0].id).toBe(
          TestCase.positive.findAll.expected.list[0].id,
        );
      });
    });

    describe('destroy', () => {
      it('should destroy a existing chat', async () => {
        jest
          .spyOn(mockChatService, 'destroy')
          .mockResolvedValueOnce(TestCase.positive.destroy.expected);

        const chat = await chatController.destroy(
          TestCase.positive.destroy.input.id,
        );
        expect(chat.id).toBe(TestCase.positive.destroy.expected.id);
      });
    });
  });
});
