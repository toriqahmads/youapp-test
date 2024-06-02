import { IBaseEntity } from './base.entity.interface';

export interface IUserEntity extends IBaseEntity {
  email: string;
  username: string;
  password: string;
}
