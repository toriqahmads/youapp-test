import { MessageType } from 'src/shared/enum/message.enum';
import { IBaseEntity } from './base.entity.interface';
import { IChatEntity } from './chat.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IReadMessage {
  by: Partial<IUserEntity>;
  time: Date;
}

export interface IDeliveredMessage {
  by: Partial<IUserEntity>;
  time: Date;
}

export interface IMessageEntity extends IBaseEntity {
  sender: Partial<IUserEntity>;
  chat: Partial<IChatEntity>;
  body: string;
  type: MessageType;
  reply_for_message?: Partial<IMessageEntity>;
  attachments?: Array<string>;
  delivereds?: Array<IDeliveredMessage>;
  reads?: Array<IReadMessage>;
}
