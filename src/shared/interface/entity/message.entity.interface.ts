import { MessageType } from 'src/shared/enum/message.enum';
import { IBaseEntity } from './base.entity.interface';
import { IChatEntity } from './chat.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IReadMessage {
  by: Partial<IUserEntity>;
  time: Date;
}

export interface IMessageEntity extends IBaseEntity {
  sender: Partial<IUserEntity>;
  chat: Partial<IChatEntity>;
  body: string;
  type: MessageType;
  attachments?: Array<string>;
  delivered_at?: Date;
  reads?: Array<IReadMessage>;
}
