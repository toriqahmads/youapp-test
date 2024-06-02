import { Schema } from 'mongoose';
import { IBaseService } from './base.service.interface';

export interface ISocketSessionService<
  Entity,
  CreateEntityDto,
  UpdateEntityDto,
  FindAllEntityDto,
> extends IBaseService<
    Entity,
    CreateEntityDto,
    UpdateEntityDto,
    FindAllEntityDto
  > {
  findByUserId(
    user_id: string | number | Schema.Types.ObjectId,
  ): Promise<Entity>;
  findBySocketId(socket_id: string): Promise<Entity>;
  destroyBySocketId(socket_id: string): Promise<Partial<Entity>>;
}
