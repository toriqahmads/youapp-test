import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { FindallUserDto } from '../dto/findall.user.dto';
import { Gender } from 'src/shared/enum/gender.enum';
import { Horoscope } from 'src/shared/enum/horoscope.enum';
import { Zodiac } from 'src/shared/enum/zodiac.enum';
import { UpsertProfileUserDto } from '../dto/upsert.profile.dto';
import { Readable } from 'stream';

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
      },
    },
    update: {
      input: {
        id: '665ad6de39eaf3baf42579c1',
        email: 'test2@gmail.com',
        username: 'test2',
        password: '1234',
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
  },
};

describe('UserController Testing', () => {
  let userController: UserController;
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

  const req = {
    user: {
      id: '665ad6de39eaf3baf42579c1',
      email: 'test@gmail.com',
      username: 'test',
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('UserController', () => {
    it('should be defined', () => {
      expect(userController).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('create', () => {
      it('should create a new user', async () => {
        const createUser: CreateUserDto = new CreateUserDto();
        Object.assign(createUser, TestCase.positive.create.input);
        jest
          .spyOn(mockUserService, 'create')
          .mockResolvedValueOnce(TestCase.positive.create.expected);

        const newUser = await userController.create(createUser);
        expect(newUser.email).toBe(TestCase.positive.create.expected.email);
        expect(newUser.username).toBe(
          TestCase.positive.create.expected.username,
        );
      });
    });

    describe('update', () => {
      it('should update a existing user', async () => {
        const updateUser: UpdateUserDto = new UpdateUserDto();
        Object.assign(updateUser, TestCase.positive.update.input);
        jest
          .spyOn(mockUserService, 'update')
          .mockResolvedValueOnce(TestCase.positive.update.expected);

        const updatedUser = await userController.update(
          TestCase.positive.update.input.id,
          updateUser,
        );
        expect(updatedUser.id).toBe(TestCase.positive.update.expected.id);
        expect(updatedUser.email).toBe(TestCase.positive.update.expected.email);
        expect(updatedUser.username).toBe(
          TestCase.positive.update.expected.username,
        );
      });
    });

    describe('findOne', () => {
      it('should findOne a existing user', async () => {
        jest
          .spyOn(mockUserService, 'findByIdWithFullDetail')
          .mockResolvedValueOnce(TestCase.positive.findOne.expected);

        const user = await userController.findOne(
          TestCase.positive.findOne.input.id,
        );
        expect(user.id).toBe(TestCase.positive.findOne.expected.id);
        expect(user.email).toBe(TestCase.positive.findOne.expected.email);
        expect(user.username).toBe(TestCase.positive.findOne.expected.username);
      });
    });

    describe('findAll', () => {
      it('should findAll a existing user', async () => {
        const findAllUser: FindallUserDto = new FindallUserDto();
        Object.assign(findAllUser, TestCase.positive.findAll.input);
        jest
          .spyOn(mockUserService, 'findAll')
          .mockResolvedValueOnce(TestCase.positive.findAll.expected);

        const users = await userController.findAll(findAllUser);
        expect(users.list.length).toBe(1);
        expect(users.list[0].id).toBe(
          TestCase.positive.findAll.expected.list[0].id,
        );
        expect(users.list[0].email).toBe(
          TestCase.positive.findAll.expected.list[0].email,
        );
        expect(users.list[0].username).toBe(
          TestCase.positive.findAll.expected.list[0].username,
        );
      });
    });

    describe('upsertProfile', () => {
      const upsertProfile = new UpsertProfileUserDto();
      Object.assign(upsertProfile, TestCase.positive.upsertProfile.input);
      it('should upsertProfile without cover for existing user', async () => {
        jest
          .spyOn(mockUserService, 'upsertProfile')
          .mockResolvedValueOnce(TestCase.positive.upsertProfile.expected);

        const user = await userController.upsertProfile(req, upsertProfile);
        expect(user.horoscope).toBe(
          TestCase.positive.upsertProfile.expected.horoscope,
        );
        expect(user.birthday).toBe(
          TestCase.positive.upsertProfile.expected.birthday,
        );
        expect(user.zodiac).toBe(
          TestCase.positive.upsertProfile.expected.zodiac,
        );
        expect(user.cover).toBe(undefined);
      });

      it('should upsertProfile with cover for existing user', async () => {
        const filename = 'test.jpg';
        upsertProfile.gender = Gender.FEMALE;
        jest.spyOn(mockUserService, 'upsertProfile').mockResolvedValueOnce({
          ...TestCase.positive.upsertProfile.expected,
          cover: `/profile_picture/${filename}`,
          gender: Gender.FEMALE,
        });

        const user = await userController.upsertProfile(req, upsertProfile, {
          filename,
          fieldname: 'profile_picture',
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
          TestCase.positive.upsertProfile.expected.horoscope,
        );
        expect(user.birthday).toBe(
          TestCase.positive.upsertProfile.expected.birthday,
        );
        expect(user.zodiac).toBe(
          TestCase.positive.upsertProfile.expected.zodiac,
        );
        expect(user.cover).toBe(`/profile_picture/${filename}`);
      });
    });
  });
});
