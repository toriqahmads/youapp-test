import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserEntity } from '../interface/entity/user.entity.interface';

export type UserDocument = User & Document;

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
export class User implements IUserEntity {
  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
