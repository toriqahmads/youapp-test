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
  toJSON: {
    getters: true,
    virtuals: true,
    transform(doc, ret) {
      if (ret._id) {
        ret.id = ret._id;
        delete ret._id;
      }

      delete ret.password;
    },
  },
})
export class Chat implements IChatEntity {
  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.name,
    },
  ])
  participants?: Partial<IUserEntity>[];

  @Prop({ default: null })
  chat_name?: string;

  @Prop({ default: null })
  recipient_id: string;

  @Prop({ default: false })
  is_group: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
