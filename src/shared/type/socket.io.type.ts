import { Socket } from 'socket.io';
import { IJWTPayload } from '../interface/jwt-payload.interface';

export type SocketIO = Socket & {
  user: Partial<IJWTPayload>;
};
