import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';
import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/service/user.service';
import { IJWTPayload } from '../../shared/interface/jwt-payload.interface';
import { RegisterDto } from '../dto/register';
import { User, UserDocument } from 'src/shared/schema/user.schema';
import { Auth, AuthDocument } from 'src/shared/schema/auth.schema';
import { IAuthService } from 'src/shared/interface/service/auth.service.interface';
import { IAuthEntity } from 'src/shared/interface/entity/auth.entity.interface';

@Injectable()
export class AuthService implements IAuthService<IAuthEntity> {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<Auth>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    username_or_email: string,
    password: string,
  ): Promise<Partial<User>> {
    const user =
      await this.userService.findByUsernameOrEmail(username_or_email);
    if (!user) {
      throw new UnauthorizedException(
        `user with username or email ${username_or_email} is not exist`,
      );
    }
    if (user && user.password) {
      if (await compare(password, user.password)) {
        throw new UnauthorizedException(`invalid password`);
      }

      user.toObject();
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    try {
      const payload: IJWTPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const access_token = this.jwtService.sign(payload);
      const refresh_token = this.jwtService.sign(payload, {
        expiresIn: '8d',
        secret: this.configService.get('JWT_REFRESH_SECRET', 'test'),
      });

      let userDocument: User;
      const auth = await this.findByUserId(user.id);
      if (auth) {
        auth.access_token = access_token;
        auth.refresh_token = refresh_token;

        await auth.save();

        if (auth.user) userDocument = auth.user;
      } else {
        const authsave = new this.authModel({
          user: user._id,
          access_token,
          refresh_token,
        });

        await authsave.save();
        userDocument = await this.userService.findByIdWithFullDetail(user.id);
      }

      return Promise.resolve({
        user: userDocument,
        access_token,
        refresh_token,
      });
    } catch (error) {
      Logger.error(error.message, error.stack);
      return Promise.reject(error);
    }
  }

  async loginByRefreshToken(refresh_token: string) {
    try {
      const validateRefresToken = this.jwtService.verify<IJWTPayload>(
        refresh_token,
        { secret: this.configService.get('JWT_REFRESH_SECRET', 'test') },
      );
      if (!validateRefresToken) {
        throw new UnauthorizedException(`refresh token expired or not valid`);
      }

      const exist = await this.findByRefreshToken(refresh_token);
      if (!exist) {
        throw new UnauthorizedException(`refresh token has been revoked`);
      }

      const user = await this.userService.findByIdWithFullDetail(
        validateRefresToken.id,
      );
      const login = await this.login(user);

      return Promise.resolve(login);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async logout(payload: IJWTPayload): Promise<boolean> {
    try {
      const auth = await this.findByUserId(payload.id);
      if (!auth) {
        throw new UnauthorizedException(`already logged out`);
      }

      await auth.deleteOne();

      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    try {
      const user = await this.userService.create({
        email: registerDto.email,
        username: registerDto.username,
        password: await hash(registerDto.password, 10),
      });

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByAccessToken(access_token: string): Promise<AuthDocument> {
    try {
      const auth = await this.authModel.findOne({ access_token });

      return Promise.resolve(auth);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByRefreshToken(refresh_token: string): Promise<AuthDocument> {
    try {
      const auth = await this.authModel.findOne({ refresh_token });

      return Promise.resolve(auth);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByUserId(user: string): Promise<AuthDocument> {
    try {
      const auth = await this.authModel.findOne({ user });

      return Promise.resolve(auth);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
