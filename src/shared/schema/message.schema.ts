import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { Chat } from './chat.schema';
import {
  IDeliveredMessage,
  IMessageEntity,
  IReadMessage,
} from '../interface/entity/message.entity.interface';
import { MessageType } from '../enum/message.enum';
import { IChatEntity } from '../interface/entity/chat.entity.interface';
import { IUserEntity } from '../interface/entity/user.entity.interface';

export type MessageDocument = Message & Document;

@Schema({
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    getters: true,
    transform(doc, ret) {
      if (ret._id) {
        ret.id = ret._id;
        delete ret._id;
      }

      delete ret.password;
    },
  },
})
export class Message implements IMessageEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  sender: Partial<IUserEntity>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Chat.name,
  })
  chat: Partial<IChatEntity>;

  @Prop()
  body: string;

  @Prop({ default: MessageType.TEXT })
  type: MessageType;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Message.name,
  })
  reply_for_message?: Partial<IMessageEntity>;

  @Prop()
  attachments?: string[];

  @Prop({ default: [] })
  delivereds?: Array<IDeliveredMessage>;

  @Prop({ default: [] })
  reads?: Array<IReadMessage>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
