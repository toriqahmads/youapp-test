import { IBaseEntity } from './base.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IChatEntity extends IBaseEntity {
  participants?: Array<Partial<IUserEntity>>;
  chat_name?: string;
  is_group: boolean;
}
