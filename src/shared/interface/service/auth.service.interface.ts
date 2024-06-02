import { RegisterDto } from 'src/auth/dto/register';
import { IUserEntity } from '../entity/user.entity.interface';
import { IJWTPayload } from '../jwt-payload.interface';
import { ILoginResponse } from '../entity/auth.entity.interface';

export interface IAuthService<Entity> {
  validateUser(
    username_or_email: string,
    password: string,
  ): Promise<Partial<IUserEntity>>;
  register(registerDto: RegisterDto): Promise<IUserEntity>;
  findByUserId(user: string): Promise<Entity>;
  findByRefreshToken(refresh_token: string): Promise<Entity>;
  findByAccessToken(access_token: string): Promise<Entity>;
  logout(payload: IJWTPayload): Promise<boolean>;
  login(user: IUserEntity): Promise<ILoginResponse>;
  loginByRefreshToken(refresh_token: string): Promise<ILoginResponse>;
}
