import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { IAuthEntity } from '../interface/entity/auth.entity.interface';

export type AuthDocument = Auth & Document;

@Schema({
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Auth implements IAuthEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop({ unique: true })
  access_token: string;

  @Prop({ index: true })
  refresh_token: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
