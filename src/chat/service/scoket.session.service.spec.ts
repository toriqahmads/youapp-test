import { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SocketSessionService } from './socket.session.service';
import { SocketSession } from 'src/shared/schema/socket.session.schema';
import { CreateSocketSessionDto } from '../dto/socket.session/create.socket.session.dto';
import { UpdateSocketSessionDto } from '../dto/socket.session/update.socket.session.dto';
import { FindallSocketSessionDto } from '../dto/socket.session/findall.socket.session.dto';

const TestCase = {
  positive: {
    create: {
      input: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
      expected: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
    },
    update: {
      input: {
        id: '665ad6de39eaf3baf42579c2',
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'bbbbcccccddddd',
      },
      expected: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'bbbbcccccddddd',
      },
    },
    destroy: {
      input: {
        id: '665ad6de39eaf3baf42579c2',
      },
      expected: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
    },
    findOne: {
      input: {
        id: '665ad6de39eaf3baf42579c2',
      },
      expected: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
    },
    findByUserId: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
    },
    findBySocketId: {
      input: {
        id: 'aabbccddee',
      },
      expected: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
    },
    findAllByUserId: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: [
        {
          user_id: '665ad6de39eaf3baf42579c1',
          socket_id: 'aabbccddee',
        },
      ],
    },
    findAll: {
      input: {
        email: 'test2@gmail.com',
        username: 'test2',
      },
      expected: {
        list: [
          {
            id: '665ad6de39eaf3baf42579c1',
            email: 'test2@gmail.com',
            username: 'test2',
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
    destroyBySocketId: {
      input: {
        id: 'aabbccddee',
      },
      expected: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
    },
  },
  negative: {
    create: {
      input: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'aabbccddee',
      },
      expected: new Error(`error mongodb`),
    },
    update: {
      input: {
        id: '665ad6de39eaf3baf42579c2',
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'bbbbcccccddddd',
      },
      expected: new Error(`error mongodb`),
    },
    destroy: {
      input: {
        id: '665ad6de39eaf3baf42579c2',
      },
      expected: new Error('Method not implemented.'),
    },
    findOne: {
      input: {
        id: '665ad6de39eaf3baf42579c2',
      },
      expected: new Error(`error mongodb`),
    },
    findByUserId: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: new Error(`error mongodb`),
    },
    findBySocketId: {
      input: {
        id: 'aabbccddee',
      },
      expected: new Error(`error mongodb`),
    },
    findAllByUserId: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: new Error(`error mongodb`),
    },
    findAll: {
      input: {
        user_id: '665ad6de39eaf3baf42579c1',
        socket_id: 'bbbbcccccddddd',
      },
      expected: new Error('Method not implemented.'),
    },
    destroyBySocketId: {
      input: {
        id: 'aabbccddee',
      },
      expected: new Error(`error mongodb`),
    },
  },
};

class MockedSocketSessionModel {
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
}

describe('SocketSession Testing', () => {
  let socketSessionService: SocketSessionService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SocketSessionService,
        {
          provide: getModelToken(SocketSession.name),
          useValue: MockedSocketSessionModel,
        },
      ],
    }).compile();

    socketSessionService = app.get<SocketSessionService>(SocketSessionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SocketSession', () => {
    it('should be defined', () => {
      expect(socketSessionService).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('create', () => {
      it('should create a new socket user', async () => {
        const createSocket: CreateSocketSessionDto =
          new CreateSocketSessionDto();
        Object.assign(createSocket, TestCase.positive.create.input);
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(TestCase.positive.create.expected);
        jest
          .spyOn(MockedSocketSessionModel, 'create')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        const newSocket = await socketSessionService.create(createSocket);
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(2);
        expect(MockedSocketSessionModel.create).toHaveBeenCalledTimes(1);
        expect(newSocket.socket_id).toBe(
          TestCase.positive.create.expected.socket_id,
        );
        expect((newSocket as any).user_id).toBe(
          TestCase.positive.create.expected.user_id,
        );
      });

      it('should create a update socket user', async () => {
        const createSocket: CreateSocketSessionDto =
          new CreateSocketSessionDto();
        Object.assign(createSocket, TestCase.positive.create.input);
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockResolvedValueOnce(TestCase.positive.create.expected)
          .mockResolvedValueOnce(TestCase.positive.create.expected);
        jest
          .spyOn(MockedSocketSessionModel, 'updateOne')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        const newSocket = await socketSessionService.create(createSocket);
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(2);
        expect(MockedSocketSessionModel.updateOne).toHaveBeenCalledTimes(1);
        expect(newSocket.socket_id).toBe(
          TestCase.positive.create.expected.socket_id,
        );
        expect((newSocket as any).user_id).toBe(
          TestCase.positive.create.expected.user_id,
        );
      });
    });

    describe('update', () => {
      it('should update a existing socket user', async () => {
        const updateSocket: UpdateSocketSessionDto =
          new UpdateSocketSessionDto();
        Object.assign(updateSocket, TestCase.positive.update.input);
        jest
          .spyOn(MockedSocketSessionModel, 'findById')
          .mockResolvedValueOnce(
            new MockedSocketSessionModel(TestCase.positive.update.expected),
          );
        jest.spyOn(MockedSocketSessionModel.prototype, 'save');

        const updatedSocket = await socketSessionService.update(
          TestCase.positive.update.input.id,
          updateSocket,
        );
        expect(MockedSocketSessionModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedSocketSessionModel.prototype.save).toHaveBeenCalledTimes(
          1,
        );
        expect(updatedSocket.socket_id).toBe(
          TestCase.positive.update.expected.socket_id,
        );
        expect((updatedSocket as any).user_id).toBe(
          TestCase.positive.update.expected.user_id,
        );
      });

      it('should update but create new socket user', async () => {
        const updateSocket: UpdateSocketSessionDto =
          new UpdateSocketSessionDto();
        Object.assign(updateSocket, TestCase.positive.update.input);
        jest
          .spyOn(MockedSocketSessionModel, 'findById')
          .mockResolvedValueOnce(null);
        jest
          .spyOn(MockedSocketSessionModel, 'create')
          .mockResolvedValueOnce(TestCase.positive.update.expected);

        const updatedSocket = await socketSessionService.update(
          TestCase.positive.update.input.id,
          updateSocket,
        );
        expect(MockedSocketSessionModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedSocketSessionModel.create).toHaveBeenCalledTimes(1);
        expect(updatedSocket.socket_id).toBe(
          TestCase.positive.update.expected.socket_id,
        );
        expect((updatedSocket as any).user_id).toBe(
          TestCase.positive.update.expected.user_id,
        );
      });
    });

    describe('findOne', () => {
      it('should findOne a existing socket user', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findById')
          .mockResolvedValueOnce(
            new MockedSocketSessionModel(TestCase.positive.findOne.expected),
          );

        const socket = await socketSessionService.findOne(
          TestCase.positive.findOne.input.id,
        );
        expect(MockedSocketSessionModel.findById).toHaveBeenCalledTimes(1);
        expect(socket.socket_id).toBe(
          TestCase.positive.findOne.expected.socket_id,
        );
        expect((socket as any).user_id).toBe(
          TestCase.positive.findOne.expected.user_id,
        );
      });
    });

    describe('findByUserId', () => {
      it('should findByUserId a existing socket user', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockResolvedValueOnce(
            new MockedSocketSessionModel(
              TestCase.positive.findByUserId.expected,
            ),
          );

        const socket = await socketSessionService.findByUserId(
          TestCase.positive.findByUserId.input.id,
        );
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledWith({
          user: TestCase.positive.findByUserId.input.id,
        });
        expect(socket.socket_id).toBe(
          TestCase.positive.findByUserId.expected.socket_id,
        );
        expect((socket as any).user_id).toBe(
          TestCase.positive.findByUserId.expected.user_id,
        );
      });
    });

    describe('findBySocketId', () => {
      it('should findBySocketId a existing socket user', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockResolvedValueOnce(
            new MockedSocketSessionModel(
              TestCase.positive.findBySocketId.expected,
            ),
          );

        const socket = await socketSessionService.findBySocketId(
          TestCase.positive.findBySocketId.input.id,
        );
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledWith({
          socket_id: TestCase.positive.findBySocketId.input.id,
        });
        expect(socket.socket_id).toBe(
          TestCase.positive.findBySocketId.expected.socket_id,
        );
        expect((socket as any).user_id).toBe(
          TestCase.positive.findBySocketId.expected.user_id,
        );
      });
    });

    describe('findAllByUserId', () => {
      it('should findAllByUserId a existing socket user', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'find')
          .mockResolvedValueOnce(
            new MockedSocketSessionModel(
              TestCase.positive.findAllByUserId.expected,
            ),
          );

        const socket = await socketSessionService.findAllByUserId([
          new Types.ObjectId(TestCase.positive.findAllByUserId.input.id),
        ]);
        expect(MockedSocketSessionModel.find).toHaveBeenCalledTimes(1);
        expect(MockedSocketSessionModel.find).toHaveBeenCalledWith({
          user: {
            $in: [
              new Types.ObjectId(TestCase.positive.findAllByUserId.input.id),
            ],
          },
        });
        expect(socket[0].socket_id).toBe(
          TestCase.positive.findBySocketId.expected.socket_id,
        );
        expect((socket as any)[0].user_id).toBe(
          TestCase.positive.findBySocketId.expected.user_id,
        );
      });
    });

    describe('destroyBySocketId', () => {
      it('should destroyBySocketId a existing socket user', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockResolvedValueOnce(
            new MockedSocketSessionModel(
              TestCase.positive.findBySocketId.expected,
            ),
          );
        jest.spyOn(MockedSocketSessionModel, 'deleteOne');

        const socket = await socketSessionService.destroyBySocketId(
          TestCase.positive.findBySocketId.input.id,
        );
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedSocketSessionModel.findOne).toHaveBeenCalledWith({
          socket_id: TestCase.positive.findBySocketId.input.id,
        });
        expect(MockedSocketSessionModel.deleteOne).toHaveBeenCalledTimes(1);
        expect(socket.socket_id).toBe(
          TestCase.positive.findBySocketId.expected.socket_id,
        );
        expect((socket as any).user_id).toBe(
          TestCase.positive.findBySocketId.expected.user_id,
        );
      });
    });
  });

  describe('Negative Test Case', () => {
    describe('create', () => {
      it('should create socket but throw error', async () => {
        const createSocket: CreateSocketSessionDto =
          new CreateSocketSessionDto();
        Object.assign(createSocket, TestCase.negative.create.input);
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.create.expected);

        try {
          await socketSessionService.create(createSocket);
        } catch (err) {
          expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.create.expected);
        }
      });
    });

    describe('update', () => {
      it('should update socket but throw error', async () => {
        const updateSocket: UpdateSocketSessionDto =
          new UpdateSocketSessionDto();
        Object.assign(updateSocket, TestCase.negative.update.input);
        jest
          .spyOn(MockedSocketSessionModel, 'findById')
          .mockRejectedValueOnce(TestCase.negative.update.expected);

        try {
          await socketSessionService.update(
            TestCase.negative.update.input.id,
            updateSocket,
          );
        } catch (err) {
          expect(MockedSocketSessionModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.update.expected);
        }
      });
    });

    describe('findOne', () => {
      it('should findOne socket but throw error', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findById')
          .mockRejectedValueOnce(TestCase.negative.findOne.expected);

        try {
          await socketSessionService.findOne(
            TestCase.negative.findOne.input.id,
          );
        } catch (err) {
          expect(MockedSocketSessionModel.findById).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findOne.expected);
        }
      });
    });

    describe('findByUserId', () => {
      it('should findByUserId socket but throw error', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.findByUserId.expected);

        try {
          await socketSessionService.findByUserId(
            TestCase.negative.findByUserId.input.id,
          );
        } catch (err) {
          expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findByUserId.expected);
        }
      });
    });

    describe('findBySocketId', () => {
      it('should findBySocketId socket but throw error', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.findBySocketId.expected);

        try {
          await socketSessionService.findBySocketId(
            TestCase.negative.findBySocketId.input.id,
          );
        } catch (err) {
          expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findBySocketId.expected);
        }
      });
    });

    describe('findAllByUserId', () => {
      it('should findAllByUserId socket but throw error', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'find')
          .mockRejectedValueOnce(TestCase.negative.findAllByUserId.expected);

        try {
          await socketSessionService.findAllByUserId([
            new Types.ObjectId(TestCase.positive.findAllByUserId.input.id),
          ]);
        } catch (err) {
          expect(MockedSocketSessionModel.find).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findAllByUserId.expected);
        }
      });
    });

    describe('destroyBySocketId', () => {
      it('should destroyBySocketId socket but throw error', async () => {
        jest
          .spyOn(MockedSocketSessionModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.destroyBySocketId.expected);

        try {
          await socketSessionService.destroyBySocketId(
            TestCase.negative.destroyBySocketId.input.id,
          );
        } catch (err) {
          expect(MockedSocketSessionModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.destroyBySocketId.expected);
        }
      });
    });

    describe('destroy', () => {
      it('should destroy socket but throw error', async () => {
        try {
          await socketSessionService.destroy(
            TestCase.negative.destroy.input.id,
          );
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.destroy.expected);
        }
      });
    });

    describe('findAll', () => {
      it('should findAll socket but throw error', async () => {
        try {
          const findAll: FindallSocketSessionDto =
            new FindallSocketSessionDto();
          Object.assign(findAll, TestCase.negative.findAll.input);
          await socketSessionService.findAll(findAll);
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findAll.expected);
        }
      });
    });
  });
});
