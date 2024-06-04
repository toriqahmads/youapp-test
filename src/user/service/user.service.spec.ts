import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../service/user.service';
import { Gender } from 'src/shared/enum/gender.enum';
import { Horoscope } from 'src/shared/enum/horoscope.enum';
import { Zodiac } from 'src/shared/enum/zodiac.enum';
import { User } from 'src/shared/schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Profile } from 'src/shared/schema/profile.schema';
import { CreateUserDto } from '../dto/create.user.dto';
import { compareSync } from 'bcrypt';
import { UpdateUserDto } from '../dto/update.user.dto';
import { FindallUserDto } from '../dto/findall.user.dto';
import { UpsertProfileUserDto } from '../dto/upsert.profile.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

const TestCase = {
  positive: {
    create: {
      input: {
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
      },
      expected: {
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
      },
    },
    update: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
        password: '12345',
      },
    },
    destroy: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
      },
    },
    findOne: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
      },
    },
    findByEmail: {
      input: {
        email: 'test2@gmail.com',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
      },
    },
    findByUsernameOrEmail: {
      input: {
        email: 'test2@gmail.com',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
      },
    },
    findByIdWithFullDetail: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
        profile: {
          display_name: 'Toriq Ahmad',
          gender: Gender.MALE,
          birthday: new Date('1997-06-02'),
          horoscope: Horoscope.GEMINI,
          zodiac: Zodiac.OX,
          height: 170,
          weight: 60,
          interests: ['proram'],
          age: 27,
        },
      },
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
    upsertProfile: {
      input: {
        display_name: 'Toriq Ahmad',
        birthday: '1997-06-02',
        gender: Gender.MALE,
        height: 170,
        weight: 60,
        interests: ['program'],
      },
      expected: {
        user: '665ad6de39eaf3baf42579c1',
        display_name: 'Toriq Ahmad',
        birthday: '1997-06-02',
        gender: Gender.MALE,
        horoscope: Horoscope.GEMINI,
        zodiac: Zodiac.OX,
        height: 170,
        weight: 60,
        interests: ['program'],
        age: 27,
      },
    },
  },
  negative: {
    create: {
      input: {
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
      },
      expected: ConflictException,
    },
    update: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test@gmail.com',
        username: 'test',
        password: '1234',
      },
      expected: ConflictException,
    },
    destroy: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
      },
    },
    findOne: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: new Error(`mongodb error`),
    },
    findByEmail: {
      input: {
        email: 'test2@gmail.com',
      },
      expected: new NotFoundException(
        `user with email test2@gmail.com not found`,
      ),
    },
    findByUsernameOrEmail: {
      input: {
        email: 'test2@gmail.com',
      },
      expected: new NotFoundException(
        `user with username or email test2@gmail.com not found`,
      ),
    },
    findByIdWithFullDetail: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
      },
      expected: new NotFoundException(
        `user with id 665ad6de39eaf3baf42579c1 not found`,
      ),
    },
    findAll: {
      input: {
        limit: 1,
        page: 1,
        email: 'test2@gmail.com',
        username: 'test2',
      },
      expected: new Error(`error mongodb`),
    },
    upsertProfile: {
      input: {
        display_name: 'Toriq Ahmad',
        birthday: '1997-06-02',
        gender: Gender.MALE,
        height: 170,
        weight: 60,
        interests: ['program'],
      },
      expected: new NotFoundException(
        `user with id 665ad6de39eaf3baf42579c1 not found`,
      ),
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

class MockedUserModel {
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
  static findOneAndDelete = jest.fn();
  static findOne = jest.fn();
  static findById = jest.fn();
  static countDocuments = jest.fn();
  static aggregate = jest.fn().mockReturnValueOnce(new MockAggregate());
}

class MockedProfileModel {
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
  static updateOne = jest.fn();
  static findOneAndDelete = jest.fn();
  static findOne = jest.fn();
  static findById = jest.fn();
  static countDocuments = jest.fn();
}

describe('UserService Testing', () => {
  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: MockedUserModel,
        },
        {
          provide: getModelToken(Profile.name),
          useValue: MockedProfileModel,
        },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('UserService', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('create', () => {
      it('should create a new user', async () => {
        const createUser: CreateUserDto = new CreateUserDto();
        Object.assign(createUser, TestCase.positive.create.input);
        jest.spyOn(MockedUserModel.prototype, 'save');
        jest
          .spyOn(MockedUserModel, 'countDocuments')
          .mockResolvedValueOnce(0)
          .mockResolvedValueOnce(0);

        const newUser = await userService.create(createUser);
        expect(MockedUserModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(2);
        expect(newUser.email).toBe(TestCase.positive.create.expected.email);
        expect(newUser.username).toBe(
          TestCase.positive.create.expected.username,
        );
        expect(
          compareSync(
            TestCase.positive.create.expected.password,
            newUser.password,
          ),
        ).toBeTruthy();
      });
    });

    describe('update', () => {
      it('should update a existing user', async () => {
        const updateUser: UpdateUserDto = new UpdateUserDto();
        Object.assign(updateUser, TestCase.positive.update.expected);
        jest.spyOn(MockedUserModel.prototype, 'save');
        jest
          .spyOn(MockedUserModel, 'countDocuments')
          .mockResolvedValueOnce(0)
          .mockResolvedValueOnce(0);
        jest
          .spyOn(MockedUserModel, 'findById')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.update.input),
          );

        const updatedUser = await userService.update(
          TestCase.positive.update.input.id,
          updateUser,
        );
        expect(MockedUserModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedUserModel.findById).toHaveBeenCalledWith(
          TestCase.positive.update.input.id,
        );
        expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(2);
        expect(updatedUser.email).toBe(TestCase.positive.update.expected.email);
        expect(updatedUser.username).toBe(
          TestCase.positive.update.expected.username,
        );
        expect(
          compareSync(
            TestCase.positive.update.expected.password,
            updatedUser.password,
          ),
        ).toBeTruthy();
      });
    });

    describe('destroy', () => {
      it('should destroy a existing user', async () => {
        jest
          .spyOn(MockedUserModel, 'findById')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.destroy.expected),
          );
        jest.spyOn(MockedUserModel.prototype, 'deleteOne');

        const user = await userService.destroy(
          TestCase.positive.destroy.input.id,
        );
        expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedUserModel.findById).toHaveBeenCalledWith(
          TestCase.positive.destroy.input.id,
        );
        expect(MockedUserModel.prototype.deleteOne).toHaveBeenCalledTimes(1);
        expect(user.email).toBe(TestCase.positive.destroy.expected.email);
        expect(user.username).toBe(TestCase.positive.destroy.expected.username);
        expect(user.password).toBeFalsy();
      });
    });

    describe('findOne', () => {
      it('should findOne a existing user', async () => {
        jest
          .spyOn(MockedUserModel, 'findById')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.findOne.expected),
          );

        const user = await userService.findOne(
          TestCase.positive.findOne.input.id,
        );
        expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
        expect(MockedUserModel.findById).toHaveBeenCalledWith(
          TestCase.positive.findOne.input.id,
        );
        expect(user.email).toBe(TestCase.positive.findOne.expected.email);
        expect(user.username).toBe(TestCase.positive.findOne.expected.username);
        expect(user.password).toBeFalsy();
      });
    });

    describe('findByEmail', () => {
      it('should findByEmail a existing user', async () => {
        jest
          .spyOn(MockedUserModel, 'findOne')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.findByEmail.expected),
          );

        const user = await userService.findByEmail(
          TestCase.positive.findByEmail.input.email,
        );
        expect(MockedUserModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedUserModel.findOne).toHaveBeenCalledWith({
          email: TestCase.positive.findByEmail.input.email,
        });
        expect(user.email).toBe(TestCase.positive.findByEmail.expected.email);
        expect(user.username).toBe(
          TestCase.positive.findByEmail.expected.username,
        );
        expect(user.password).toBeFalsy();
      });
    });

    describe('findByUsernameOrEmail', () => {
      it('should findByUsernameOrEmail a existing user', async () => {
        jest
          .spyOn(MockedUserModel, 'findOne')
          .mockResolvedValueOnce(
            new MockedUserModel(
              TestCase.positive.findByUsernameOrEmail.expected,
            ),
          );

        const user = await userService.findByUsernameOrEmail(
          TestCase.positive.findByUsernameOrEmail.input.email,
        );
        expect(MockedUserModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedUserModel.findOne).toHaveBeenCalledWith({
          $or: [
            { username: TestCase.positive.findByUsernameOrEmail.input.email },
            { email: TestCase.positive.findByUsernameOrEmail.input.email },
          ],
        });
        expect(user.email).toBe(
          TestCase.positive.findByUsernameOrEmail.expected.email,
        );
        expect(user.username).toBe(
          TestCase.positive.findByUsernameOrEmail.expected.username,
        );
        expect(user.password).toBeFalsy();
      });
    });
  });

  describe('isEmailDuplicate', () => {
    it('should check isEmailDuplicate and return true', async () => {
      jest.spyOn(MockedUserModel, 'countDocuments').mockResolvedValueOnce(1);

      const isDuplicate = await userService.isEmailDuplicate(
        TestCase.positive.findByEmail.input.email,
      );
      expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(1);
      expect(MockedUserModel.countDocuments).toHaveBeenCalledWith({
        email: TestCase.positive.findByEmail.input.email,
      });
      expect(isDuplicate).toBeTruthy();
    });
  });

  describe('isUsernameDuplicate', () => {
    it('should check isUsernameDuplicate and return true', async () => {
      jest.spyOn(MockedUserModel, 'countDocuments').mockResolvedValueOnce(1);

      const isDuplicate = await userService.isUsernameDuplicate(
        TestCase.positive.findByEmail.expected.username,
      );
      expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(1);
      expect(MockedUserModel.countDocuments).toHaveBeenCalledWith({
        username: TestCase.positive.findByEmail.expected.username,
      });
      expect(isDuplicate).toBeTruthy();
    });
  });

  describe('findAll', () => {
    it('should findAll users', async () => {
      const findAll: FindallUserDto = new FindallUserDto();
      Object.assign(findAll, TestCase.positive.findAll.input);
      jest
        .spyOn(MockedUserModel, 'aggregate')
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

      const users = await userService.findAll(findAll);
      expect(MockedUserModel.aggregate).toHaveBeenCalledTimes(2);
      expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
      expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
      expect(MockAggregate.prototype.count).toHaveBeenCalledTimes(1);
      expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(2);
      expect(users.list.length).toBe(
        TestCase.positive.findAll.expected.list.length,
      );
      expect(users.pagination.per_page).toBe(25);
      expect(users.list[0].email).toBe(
        TestCase.positive.findAll.expected.list[0].email,
      );
    });

    it('should findAll users but return 0', async () => {
      const findAll: FindallUserDto = new FindallUserDto();
      Object.assign(findAll, TestCase.positive.findAll.input);
      jest
        .spyOn(MockedUserModel, 'aggregate')
        .mockReturnValueOnce(new MockAggregate());
      jest.spyOn(MockAggregate.prototype, 'limit');
      jest.spyOn(MockAggregate.prototype, 'skip');
      jest
        .spyOn(MockAggregate.prototype, 'exec')
        .mockResolvedValueOnce([] as never);

      const users = await userService.findAll(findAll);
      expect(MockedUserModel.aggregate).toHaveBeenCalledTimes(1);
      expect(MockAggregate.prototype.limit).toHaveBeenCalledTimes(1);
      expect(MockAggregate.prototype.skip).toHaveBeenCalledTimes(1);
      expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(1);
      expect(users.list.length).toBe(0);
    });
  });

  describe('findByIdWithFullDetail', () => {
    it('should findByIdWithFullDetail with specific id', async () => {
      jest
        .spyOn(MockedUserModel, 'aggregate')
        .mockReturnValueOnce(new MockAggregate());
      jest
        .spyOn(MockAggregate.prototype, 'exec')
        .mockResolvedValueOnce([
          TestCase.positive.findByIdWithFullDetail.expected,
        ] as never);

      const user = await userService.findByIdWithFullDetail(
        TestCase.positive.findByIdWithFullDetail.input.id,
      );
      expect(MockedUserModel.aggregate).toHaveBeenCalledTimes(1);
      expect(MockAggregate.prototype.exec).toHaveBeenCalledTimes(1);
      expect(user.id).toBe(
        TestCase.positive.findByIdWithFullDetail.expected.id,
      );
      expect((user as any).profile).toBe(
        TestCase.positive.findByIdWithFullDetail.expected.profile,
      );
    });
  });

  describe('upsertProfile', () => {
    it('should upsertProfile with specific id', async () => {
      const upsertProfile: UpsertProfileUserDto = new UpsertProfileUserDto();
      Object.assign(upsertProfile, TestCase.positive.upsertProfile.input);
      delete upsertProfile.birthday;

      jest
        .spyOn(MockedUserModel, 'findById')
        .mockReturnValueOnce(TestCase.positive.findOne.expected);
      jest
        .spyOn(MockedProfileModel, 'findOne')
        .mockResolvedValue(TestCase.positive.upsertProfile.expected);
      jest.spyOn(MockedProfileModel, 'updateOne');

      const profile = await userService.upsertProfile(
        TestCase.positive.findOne.input.id,
        upsertProfile,
      );

      expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
      expect(MockedProfileModel.findOne).toHaveBeenCalledTimes(2);
      expect(MockedProfileModel.updateOne).toHaveBeenCalledTimes(1);
      expect(profile.user).toBe(TestCase.positive.findOne.expected.id);
      expect(profile.horoscope).toBe(
        TestCase.positive.upsertProfile.expected.horoscope,
      );
      expect(profile.zodiac).toBe(
        TestCase.positive.upsertProfile.expected.zodiac,
      );
      expect(profile.age).toBe(TestCase.positive.upsertProfile.expected.age);
    });

    it('should upsertProfile with specific id with create', async () => {
      const upsertProfile: UpsertProfileUserDto = new UpsertProfileUserDto();
      Object.assign(upsertProfile, TestCase.positive.upsertProfile.input);

      jest
        .spyOn(MockedUserModel, 'findById')
        .mockReturnValueOnce(TestCase.positive.findOne.expected);
      jest
        .spyOn(MockedProfileModel, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(TestCase.positive.upsertProfile.expected);
      jest.spyOn(MockedProfileModel, 'create');

      const profile = await userService.upsertProfile(
        TestCase.positive.findOne.input.id,
        upsertProfile,
      );

      expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
      expect(MockedProfileModel.findOne).toHaveBeenCalledTimes(2);
      expect(MockedProfileModel.create).toHaveBeenCalledTimes(1);
      expect(profile.user).toBe(TestCase.positive.findOne.expected.id);
      expect(profile.horoscope).toBe(
        TestCase.positive.upsertProfile.expected.horoscope,
      );
      expect(profile.zodiac).toBe(
        TestCase.positive.upsertProfile.expected.zodiac,
      );
      expect(profile.age).toBe(TestCase.positive.upsertProfile.expected.age);
    });
  });

  describe('Negative Test Case', () => {
    describe('create', () => {
      it('should create a new user and throw error duplicate email', async () => {
        const createUser: CreateUserDto = new CreateUserDto();
        Object.assign(createUser, TestCase.positive.create.input);
        jest.spyOn(MockedUserModel, 'countDocuments').mockResolvedValueOnce(1);

        try {
          await userService.create(createUser);
        } catch (err) {
          expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(TestCase.negative.create.expected);
          expect(err).toEqual(
            new ConflictException(
              `email ${createUser.email} already registered`,
            ),
          );
        }
      });

      it('should create a new user and throw error duplicate username', async () => {
        const createUser: CreateUserDto = new CreateUserDto();
        Object.assign(createUser, TestCase.positive.create.input);
        jest
          .spyOn(MockedUserModel, 'countDocuments')
          .mockResolvedValueOnce(0)
          .mockResolvedValueOnce(1);

        try {
          await userService.create(createUser);
        } catch (err) {
          expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(2);
          expect(err).toBeInstanceOf(TestCase.negative.create.expected);
          expect(err).toEqual(
            new ConflictException(
              `username ${createUser.username} already taken`,
            ),
          );
        }
      });
    });

    describe('update', () => {
      it('should update a existing user and throw error duplicate email', async () => {
        const updateUser: UpdateUserDto = new UpdateUserDto();
        Object.assign(updateUser, TestCase.positive.update.expected);
        jest.spyOn(MockedUserModel, 'countDocuments').mockResolvedValueOnce(1);
        jest
          .spyOn(MockedUserModel, 'findById')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.update.input),
          );

        try {
          await userService.update(
            TestCase.negative.update.input.id,
            updateUser,
          );
        } catch (err) {
          expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findById).toHaveBeenCalledWith(
            TestCase.negative.update.input.id,
          );
          expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(TestCase.negative.update.expected);
          expect(err).toEqual(
            new ConflictException(
              `email ${updateUser.email} already registered`,
            ),
          );
        }
      });

      it('should update a existing user and throw error duplicate username', async () => {
        const updateUser: UpdateUserDto = new UpdateUserDto();
        Object.assign(updateUser, TestCase.positive.update.expected);
        delete updateUser.email;
        jest.spyOn(MockedUserModel, 'countDocuments').mockResolvedValueOnce(1);
        jest
          .spyOn(MockedUserModel, 'findById')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.update.input),
          );

        try {
          await userService.update(
            TestCase.negative.update.input.id,
            updateUser,
          );
        } catch (err) {
          expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findById).toHaveBeenCalledWith(
            TestCase.negative.update.input.id,
          );
          expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(TestCase.negative.update.expected);
          expect(err).toEqual(
            new ConflictException(
              `username ${updateUser.username} already taken`,
            ),
          );
        }
      });

      it('should update a existing user and throw error user not found', async () => {
        const updateUser: UpdateUserDto = new UpdateUserDto();
        Object.assign(updateUser, TestCase.positive.update.expected);
        jest.spyOn(MockedUserModel, 'findById').mockResolvedValueOnce(null);

        try {
          await userService.update(
            TestCase.negative.update.input.id,
            updateUser,
          );
        } catch (err) {
          expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findById).toHaveBeenCalledWith(
            TestCase.negative.update.input.id,
          );
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(
            new NotFoundException(
              `user with id ${TestCase.negative.update.input.id} not found`,
            ),
          );
        }
      });
    });

    describe('destroy', () => {
      it('should destroy a user but throw user not found', async () => {
        jest.spyOn(MockedUserModel, 'findById').mockResolvedValueOnce(null);

        try {
          await userService.destroy(TestCase.negative.destroy.input.id);
        } catch (err) {
          expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findById).toHaveBeenCalledWith(
            TestCase.negative.destroy.input.id,
          );
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(
            new NotFoundException(
              `user with id ${TestCase.negative.destroy.input.id} not found`,
            ),
          );
        }
      });
    });

    describe('findOne', () => {
      it('should findOne a existing user and return error', async () => {
        jest
          .spyOn(MockedUserModel, 'findById')
          .mockRejectedValueOnce(TestCase.negative.findOne.expected);

        try {
          await userService.findOne(TestCase.negative.findOne.input.id);
        } catch (err) {
          expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findById).toHaveBeenCalledWith(
            TestCase.negative.findOne.input.id,
          );
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findOne.expected);
        }
      });
    });

    describe('findByEmail', () => {
      it('should findByEmail a existing user and return error', async () => {
        jest.spyOn(MockedUserModel, 'findOne').mockResolvedValueOnce(null);

        try {
          await userService.findByEmail(
            TestCase.negative.findByEmail.input.email,
          );
        } catch (err) {
          expect(MockedUserModel.findOne).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findOne).toHaveBeenCalledWith({
            email: TestCase.positive.findByEmail.input.email,
          });
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findByEmail.expected);
        }
      });
    });

    describe('findByUsernameOrEmail', () => {
      it('should findByUsernameOrEmail a existing user and return error user not found', async () => {
        jest.spyOn(MockedUserModel, 'findOne').mockResolvedValueOnce(null);

        try {
          await userService.findByUsernameOrEmail(
            TestCase.negative.findByUsernameOrEmail.input.email,
          );
        } catch (err) {
          expect(MockedUserModel.findOne).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findOne).toHaveBeenCalledWith({
            $or: [
              { username: TestCase.negative.findByUsernameOrEmail.input.email },
              { email: TestCase.negative.findByUsernameOrEmail.input.email },
            ],
          });
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.findByUsernameOrEmail.expected);
        }
      });
    });

    describe('isEmailDuplicate', () => {
      it('should check isEmailDuplicate and return error', async () => {
        const error = new Error('mongodb error');
        jest
          .spyOn(MockedUserModel, 'countDocuments')
          .mockRejectedValueOnce(error);

        try {
          await userService.isEmailDuplicate(
            TestCase.negative.findByEmail.input.email,
          );
        } catch (err) {
          expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.countDocuments).toHaveBeenCalledWith({
            email: TestCase.positive.findByEmail.input.email,
          });
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('isUsernameDuplicate', () => {
      it('should check isUsernameDuplicate and return error', async () => {
        const error = new Error('mongodb error');
        jest
          .spyOn(MockedUserModel, 'countDocuments')
          .mockRejectedValueOnce(error);

        try {
          await userService.isUsernameDuplicate(
            TestCase.negative.findByEmail.input.email,
          );
        } catch (err) {
          expect(MockedUserModel.countDocuments).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.countDocuments).toHaveBeenCalledWith({
            username: TestCase.positive.findByEmail.input.email,
          });
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(error);
        }
      });
    });

    describe('findAll', () => {
      it('should findAll user and return error', async () => {
        const findAll: FindallUserDto = new FindallUserDto();
        Object.assign(findAll, TestCase.negative.findAll.input);
        jest
          .spyOn(MockedUserModel, 'aggregate')
          .mockReturnValueOnce(new MockAggregate());
        jest.spyOn(MockAggregate.prototype, 'limit');
        jest.spyOn(MockAggregate.prototype, 'skip');
        jest
          .spyOn(MockAggregate.prototype, 'exec')
          .mockRejectedValueOnce(TestCase.negative.findAll.expected as never);

        try {
          await userService.findAll(findAll);
        } catch (err) {
          expect(MockedUserModel.aggregate).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findAll.expected);
        }
      });
    });

    describe('findByIdWithFullDetail', () => {
      it('should findByIdWithFullDetail a existing user and return error user not found', async () => {
        jest
          .spyOn(MockedUserModel, 'aggregate')
          .mockReturnValueOnce(new MockAggregate());
        jest
          .spyOn(MockAggregate.prototype, 'exec')
          .mockResolvedValueOnce([] as never);

        try {
          await userService.findByIdWithFullDetail(
            TestCase.negative.findByIdWithFullDetail.input.id,
          );
        } catch (err) {
          expect(MockedUserModel.aggregate).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(
            TestCase.negative.findByIdWithFullDetail.expected,
          );
        }
      });
    });

    describe('upsertProfile', () => {
      it('should upsertProfile a existing user and throw user not found', async () => {
        const upsertProfile: UpsertProfileUserDto = new UpsertProfileUserDto();
        Object.assign(upsertProfile, TestCase.negative.upsertProfile.expected);
        jest.spyOn(MockedUserModel, 'findById').mockResolvedValueOnce(null);

        try {
          await userService.upsertProfile(
            TestCase.negative.update.input.id,
            upsertProfile,
          );
        } catch (err) {
          expect(MockedUserModel.findById).toHaveBeenCalledTimes(1);
          expect(MockedUserModel.findById).toHaveBeenCalledWith(
            TestCase.negative.update.input.id,
          );
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err).toEqual(TestCase.negative.upsertProfile.expected);
        }
      });
    });
  });
});
