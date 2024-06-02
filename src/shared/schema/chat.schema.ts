import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { IChatEntity } from '../interface/entity/chat.entity.interface';
import { IUserEntity } from '../interface/entity/user.entity.interface';

export type ChatDocument = Chat & Document;

@Schema({
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Chat implements IChatEntity {
  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.name,
    },
  ])
  participants?: Partial<IUserEntity>[];

  @Prop()
  chat_name?: string;

  @Prop({ default: false })
  is_group: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
