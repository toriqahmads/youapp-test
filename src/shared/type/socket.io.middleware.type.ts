import { Socket } from 'socket.io';

export type SocketIOMiddleware = {
  (socket: Socket, next: (err?: Error) => void);
};
