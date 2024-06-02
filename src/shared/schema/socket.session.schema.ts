import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { ISocketSessionEntity } from '../interface/entity/socket.session.entity.interface';

export type SocketSessionDocument = SocketSession & Document;

@Schema({
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class SocketSession implements ISocketSessionEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  user: User;

  @Prop()
  socket_id: string;
}

export const SocketSessionSchema = SchemaFactory.createForClass(SocketSession);
