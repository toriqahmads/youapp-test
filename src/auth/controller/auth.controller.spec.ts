import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register';
import { LoginByRefreshTokenDto } from '../dto/login-by-refresh-token.dto';
import { LoginDto } from '../dto/login.dto';

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
    loginByRefreshToken: {
      input: {
        refresh_token: 'refresh token',
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
  },
};

describe('AuthController Testing', () => {
  let authController: AuthController;
  const mockAuthService = {
    register: jest.fn(),
    logout: jest.fn(),
    login: jest.fn(),
    loginByRefreshToken: jest.fn(),
  };

  const req = {
    user: {
      id: '665ad6de39eaf3baf42579c1',
      email: 'test@gmail.com',
      authname: 'test',
    },
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('AuthController', () => {
    it('should be defined', () => {
      expect(authController).toBeDefined();
    });
  });

  describe('Positive Test Case', () => {
    describe('register', () => {
      it('should register', async () => {
        const registerDto: RegisterDto = new RegisterDto();
        Object.assign(registerDto, TestCase.positive.register.input);
        jest
          .spyOn(mockAuthService, 'register')
          .mockResolvedValueOnce(TestCase.positive.register.expected);

        const user = await authController.register(
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

        const auth = await authController.login(req);
        expect(auth.user).toEqual(TestCase.positive.login.expected.user);
      });
    });

    describe('loginByRefreshToken', () => {
      it('should loginByRefreshToken', async () => {
        jest
          .spyOn(mockAuthService, 'loginByRefreshToken')
          .mockResolvedValueOnce(
            TestCase.positive.loginByRefreshToken.expected,
          );

        const loginByRefreshTokenDto: LoginByRefreshTokenDto =
          new LoginByRefreshTokenDto();
        Object.assign(
          loginByRefreshTokenDto,
          TestCase.positive.loginByRefreshToken.input,
        );
        const auth = await authController.loginByRefreshToken(
          loginByRefreshTokenDto,
        );
        expect(auth.user).toEqual(
          TestCase.positive.loginByRefreshToken.expected.user,
        );
      });
    });

    describe('getAuthenticated', () => {
      it('should getAuthenticated', async () => {
        const user = await authController.getAuthenticated(req);
        expect(user).toEqual(req.user);
      });
    });

    describe('logout', () => {
      it('should logout a existing auth', async () => {
        jest.spyOn(mockAuthService, 'logout').mockResolvedValueOnce(true);

        const auth = await authController.logout(req);
        expect(auth).toBeTruthy();
      });
    });
  });
});
