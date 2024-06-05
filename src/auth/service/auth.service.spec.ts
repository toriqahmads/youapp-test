import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { Auth } from 'src/shared/schema/auth.schema';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/shared/schema/user.schema';
import { jwtConstants } from 'src/shared/constant/jwt.constant';
import { RegisterDto } from '../dto/register';

const TestCase = {
  positive: {
    validateUser: {
      input: {
        username_or_email: 'test',
        password: '1234',
      },
      expected: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: '1234',
        password:
          '$2b$10$tPhEhiLw6nF4YvPlz7GiWOYvrtp9.qDuv46dHhYAkNY4ud8EcThVK',
      },
    },
    login: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: {
        user: {
          id: '165ad6de39eaf3baf42579e9',
          email: 'test@gmail.com',
          username: 'test',
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODA4OTI5NX0.DI_8mpNSLimfPuB1Uxqxm1lqP-CWqnuxqZETOCDbix0',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODE3NTY5NX0.L0v6cSxvNyGQIC2ypqDa0_T2COii0XhLW43oh1IOEwM',
      },
    },
    loginByRefreshToken: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: {
        user: {
          id: '165ad6de39eaf3baf42579e9',
          email: 'test@gmail.com',
          username: 'test',
        },
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODA4OTI5NX0.DI_8mpNSLimfPuB1Uxqxm1lqP-CWqnuxqZETOCDbix0',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODE3NTY5NX0.L0v6cSxvNyGQIC2ypqDa0_T2COii0XhLW43oh1IOEwM',
      },
    },
    logout: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: {
        user: '165ad6de39eaf3baf42579e9',
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODA4OTI5NX0.DI_8mpNSLimfPuB1Uxqxm1lqP-CWqnuxqZETOCDbix0',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODE3NTY5NX0.L0v6cSxvNyGQIC2ypqDa0_T2COii0XhLW43oh1IOEwM',
      },
    },
    register: {
      input: {
        username: 'test',
        email: 'test2@gmail.com',
        password: 'test',
      },
      expected: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
        password:
          '$2b$10$JyBN6/UMzdSarl2TQ.pMZOcTfxpw6mf92vUAXeGomP7zcwa9BHO3i',
      },
    },
    findByAccessToken: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: {
        user: '165ad6de39eaf3baf42579e9',
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODA4OTI5NX0.DI_8mpNSLimfPuB1Uxqxm1lqP-CWqnuxqZETOCDbix0',
        refresh_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFkNmRlMzllYWYzYmFmNDI1NzljMSIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE3MTc0ODQ0OTUsImV4cCI6MTcxODE3NTY5NX0.L0v6cSxvNyGQIC2ypqDa0_T2COii0XhLW43oh1IOEwM',
      },
    },
  },
  negative: {
    validateUser: {
      input: {
        username_or_email: 'test',
        password: 'test222',
      },
      expected: new UnauthorizedException(
        `user with username or email test is not exist`,
      ),
    },
    login: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: new Error(`mongodb error`),
    },
    loginByRefreshToken: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: new UnauthorizedException(`refresh token expired or not valid`),
    },
    logout: {
      input: {
        id: '165ad6de39eaf3baf42579e9',
        email: 'test@gmail.com',
        username: 'test',
      },
      expected: new UnauthorizedException(`already logged out`),
    },
    register: {
      input: {
        username: 'test',
        email: 'test2@gmail.com',
        password: 'test',
      },
      expected: new Error(`mongodb error`),
    },
    findByAccessToken: {
      input: 'access token',
      expected: new Error(`mongodb error`),
    },
    findByRefreshToken: {
      input: 'access token',
      expected: new Error(`mongodb error`),
    },
    findByUserId: {
      input: '165ad6de39eaf3baf42579e9',
      expected: new Error(`mongodb error`),
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
  toObject() {
    return Object.setPrototypeOf(this, Object.prototype);
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

class MockedAuthModel {
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

describe('Auth Testing', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Auth.name),
          useValue: MockedAuthModel,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: new JwtService({
            secret: jwtConstants.secretOrPrivateKey,
            signOptions: {
              expiresIn: '7d',
            },
          }),
        },
        {
          provide: ConfigService,
          useClass: ConfigService,
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    jwtService = app.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('validateUser', () => {
      it('should validateUser', async () => {
        jest
          .spyOn(mockUserService, 'findByUsernameOrEmail')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.validateUser.expected),
          );

        const user = await authService.validateUser(
          TestCase.positive.validateUser.input.username_or_email,
          TestCase.positive.validateUser.input.password,
        );
        expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
        expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledWith(
          TestCase.positive.validateUser.input.username_or_email,
        );
        expect(user.email).toBe(TestCase.positive.validateUser.expected.email);
        expect(user.username).toBe(
          TestCase.positive.validateUser.expected.username,
        );
      });

      it('should validateUser and return null', async () => {
        jest
          .spyOn(mockUserService, 'findByUsernameOrEmail')
          .mockResolvedValueOnce(
            new MockedUserModel({
              ...TestCase.positive.validateUser.expected,
              password: null,
            }),
          );

        const user = await authService.validateUser(
          TestCase.positive.validateUser.input.username_or_email,
          TestCase.positive.validateUser.input.password,
        );
        expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledTimes(1);
        expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledWith(
          TestCase.positive.validateUser.input.username_or_email,
        );
        expect(user).toBe(null);
      });
    });

    describe('login', () => {
      it('should login use existing user and update existing auth', async () => {
        const user = new MockedUserModel(TestCase.positive.login.input);
        const auth = new MockedAuthModel(TestCase.positive.login.expected);
        jest.spyOn(MockedAuthModel, 'findOne').mockResolvedValueOnce(auth);

        const login = await authService.login(user as unknown as UserDocument);
        expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedAuthModel.findOne).toHaveBeenCalledWith({
          user: TestCase.positive.login.input.id,
        });
        expect(login.user).toEqual(TestCase.positive.login.expected.user);
      });

      it('should login use existing user and create new auth', async () => {
        const user = new MockedUserModel(TestCase.positive.login.input);
        jest.spyOn(MockedAuthModel, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(MockedAuthModel, 'create');
        jest
          .spyOn(mockUserService, 'findByIdWithFullDetail')
          .mockResolvedValueOnce(user);

        const login = await authService.login(user as unknown as UserDocument);
        expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedAuthModel.findOne).toHaveBeenCalledWith({
          user: TestCase.positive.login.input.id,
        });
        expect(MockedAuthModel.create).toHaveBeenCalledTimes(1);
        expect(mockUserService.findByIdWithFullDetail).toHaveBeenCalledTimes(1);
        expect(mockUserService.findByIdWithFullDetail).toHaveBeenCalledWith(
          TestCase.positive.login.input.id,
        );
        expect(login.user).toEqual(TestCase.positive.login.expected.user);
      });
    });

    describe('loginByRefreshToken', () => {
      it('should loginByRefreshToken a existing auth user', async () => {
        const user = new MockedUserModel(
          TestCase.positive.loginByRefreshToken.input,
        );
        const auth = new MockedAuthModel(
          TestCase.positive.loginByRefreshToken.expected,
        );
        const refreshToken = jwtService.sign(
          TestCase.positive.loginByRefreshToken.input,
          {
            expiresIn: '8d',
            secret: jwtConstants.secretOrPrivateKey,
          },
        );
        jest.spyOn(MockedAuthModel, 'findOne').mockResolvedValueOnce(auth);
        jest.spyOn(MockedAuthModel, 'findOne').mockResolvedValueOnce(auth);
        jest.spyOn(MockedAuthModel.prototype, 'save');
        jest.spyOn(mockUserService, 'findOne').mockResolvedValueOnce(user);
        jest
          .spyOn(ConfigService.prototype, 'get')
          .mockReturnValueOnce(jwtConstants.secretOrPrivateKey);

        const login = await authService.loginByRefreshToken(refreshToken);
        expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(2);
        expect(MockedAuthModel.prototype.save).toHaveBeenCalledTimes(1);
        expect(login.user).toEqual(
          TestCase.positive.loginByRefreshToken.expected.user,
        );
      });
    });

    describe('logout', () => {
      it('should logout', async () => {
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockResolvedValueOnce(
            new MockedAuthModel(TestCase.positive.logout.expected),
          );

        const auth = await authService.logout(TestCase.positive.logout.input);
        expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedAuthModel.findOne).toHaveBeenCalledWith({
          user: TestCase.positive.logout.input.id,
        });
        expect(auth).toBeTruthy();
      });
    });

    describe('register', () => {
      it('should register', async () => {
        const registerDto: RegisterDto = new RegisterDto();
        Object.assign(registerDto, TestCase.positive.register.input);
        jest
          .spyOn(mockUserService, 'create')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.register.expected),
          );

        const auth = await authService.register(registerDto);
        expect(mockUserService.create).toHaveBeenCalledTimes(1);
        expect(auth).toBeTruthy();
        expect(auth.email).toBe(TestCase.positive.register.expected.email);
      });
    });

    describe('findByAccessToken', () => {
      it('should findByAccessToken', async () => {
        const accessToken = jwtService.sign(
          TestCase.positive.findByAccessToken.input,
          {
            expiresIn: '8d',
            secret: jwtConstants.secretOrPrivateKey,
          },
        );
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockResolvedValueOnce(TestCase.positive.findByAccessToken.expected);

        const auth = await authService.findByAccessToken(accessToken);
        expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedAuthModel.findOne).toHaveBeenCalledWith({
          access_token: accessToken,
        });
        expect(auth).toBeTruthy();
      });
    });

    describe('findByRefreshToken', () => {
      it('should findByRefreshToken', async () => {
        const refreshToken = jwtService.sign(
          TestCase.positive.loginByRefreshToken.input,
          {
            expiresIn: '8d',
            secret: jwtConstants.secretOrPrivateKey,
          },
        );
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockResolvedValueOnce(
            TestCase.positive.loginByRefreshToken.expected,
          );

        const auth = await authService.findByRefreshToken(refreshToken);
        expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedAuthModel.findOne).toHaveBeenCalledWith({
          refresh_token: refreshToken,
        });
        expect(auth).toBeTruthy();
      });
    });

    describe('findByUserId', () => {
      it('should findByUserId', async () => {
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockResolvedValueOnce(TestCase.positive.login.expected);

        const auth = await authService.findByUserId(
          TestCase.positive.login.expected.user.id,
        );
        expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
        expect(MockedAuthModel.findOne).toHaveBeenCalledWith({
          user: TestCase.positive.login.expected.user.id,
        });
        expect(auth).toBeTruthy();
      });
    });
  });

  describe('Negative Test Case', () => {
    describe('validateUser', () => {
      it('should validateUser chat but throw error user not found', async () => {
        jest
          .spyOn(mockUserService, 'findByUsernameOrEmail')
          .mockResolvedValueOnce(null);
        try {
          await authService.validateUser(
            TestCase.positive.validateUser.input.username_or_email,
            TestCase.positive.validateUser.input.password,
          );
        } catch (err) {
          expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledTimes(
            1,
          );
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err).toEqual(TestCase.negative.validateUser.expected);
        }
      });

      it('should validateUser chat but throw error password not valid', async () => {
        jest
          .spyOn(mockUserService, 'findByUsernameOrEmail')
          .mockResolvedValueOnce(
            new MockedUserModel(TestCase.positive.validateUser.expected),
          );
        try {
          await authService.validateUser(
            TestCase.positive.validateUser.input.username_or_email,
            TestCase.negative.validateUser.input.password,
          );
        } catch (err) {
          expect(mockUserService.findByUsernameOrEmail).toHaveBeenCalledTimes(
            1,
          );
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err).toEqual(new UnauthorizedException(`invalid password`));
        }
      });
    });

    describe('login', () => {
      it('should login but throw error', async () => {
        const user = new MockedUserModel(TestCase.positive.login.input);
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.login.expected);

        try {
          await authService.login(user as unknown as UserDocument);
        } catch (err) {
          expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.login.expected);
        }
      });
    });

    describe('loginByRefreshToken', () => {
      it('should loginByRefreshToken but throw error', async () => {
        const refreshToken = jwtService.sign(
          TestCase.positive.loginByRefreshToken.input,
          {
            expiresIn: '8d',
            secret: jwtConstants.secretOrPrivateKey,
          },
        );
        jest.spyOn(JwtService.prototype, 'verify').mockReturnValueOnce(null);

        try {
          await authService.loginByRefreshToken(refreshToken);
        } catch (err) {
          expect(JwtService.prototype.verify).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err).toEqual(TestCase.negative.loginByRefreshToken.expected);
        }
      });

      it('should loginByRefreshToken but throw error token revoked', async () => {
        const refreshToken = jwtService.sign(
          TestCase.positive.loginByRefreshToken.input,
          {
            expiresIn: '8d',
            secret: jwtConstants.secretOrPrivateKey,
          },
        );
        jest
          .spyOn(ConfigService.prototype, 'get')
          .mockReturnValueOnce(jwtConstants.secretOrPrivateKey);
        jest.spyOn(MockedAuthModel, 'findOne').mockResolvedValueOnce(null);

        try {
          await authService.loginByRefreshToken(refreshToken);
        } catch (err) {
          expect(JwtService.prototype.verify).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err).toEqual(
            new UnauthorizedException(`refresh token has been revoked`),
          );
        }
      });
    });

    describe('logout', () => {
      it('should logout but throw error', async () => {
        jest.spyOn(MockedAuthModel, 'findOne').mockResolvedValueOnce(null);

        try {
          await authService.logout(TestCase.negative.logout.input);
        } catch (err) {
          expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(UnauthorizedException);
          expect(err).toEqual(TestCase.negative.logout.expected);
        }
      });
    });

    describe('register', () => {
      it('should register but throw error', async () => {
        jest
          .spyOn(mockUserService, 'create')
          .mockRejectedValueOnce(TestCase.negative.register.expected);

        try {
          await authService.register(TestCase.negative.register.input);
        } catch (err) {
          expect(mockUserService.create).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.register.expected);
        }
      });
    });

    describe('findByAccessToken', () => {
      it('should findByAccessToken but throw error', async () => {
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.findByAccessToken.expected);

        try {
          await authService.findByAccessToken(
            TestCase.negative.findByAccessToken.input,
          );
        } catch (err) {
          expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findByAccessToken.expected);
        }
      });
    });

    describe('findByRefreshToken', () => {
      it('should findByRefreshToken but throw error', async () => {
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.findByRefreshToken.expected);

        try {
          await authService.findByRefreshToken(
            TestCase.negative.findByRefreshToken.input,
          );
        } catch (err) {
          expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findByRefreshToken.expected);
        }
      });
    });

    describe('findByUserId', () => {
      it('should findByUserId but throw error', async () => {
        jest
          .spyOn(MockedAuthModel, 'findOne')
          .mockRejectedValueOnce(TestCase.negative.findByUserId.expected);

        try {
          await authService.findByUserId(TestCase.negative.findByUserId.input);
        } catch (err) {
          expect(MockedAuthModel.findOne).toHaveBeenCalledTimes(1);
          expect(err).toBeInstanceOf(Error);
          expect(err).toEqual(TestCase.negative.findByUserId.expected);
        }
      });
    });
  });
});
