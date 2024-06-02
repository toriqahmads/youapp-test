import { IBaseEntity } from './base.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IAuthEntity extends IBaseEntity {
  access_token: string;
  refresh_token: string;
}

export interface ILoginResponse {
  user: Partial<IUserEntity>;
  access_token: string;
  refresh_token: string;
}
