import { IBaseEntity } from './base.entity.interface';
import { IMessageEntity } from './message.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IChatEntity extends IBaseEntity {
  participants?: Array<Partial<IUserEntity>>;
  chat_name?: string;
  recipient_id: string;
  is_group: boolean;
}

export interface SendMessageEntity {
  chat: Partial<IChatEntity>;
  message: Partial<IMessageEntity>;
}
