import { IBaseEntity } from './base.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface ISocketSessionEntity extends IBaseEntity {
  socket_id: string;
  user: Partial<IUserEntity>;
}
