import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';
import { IBaseService } from './base.service.interface';
import { Types } from 'mongoose';

export interface IMessageService<
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
  findMyMessages(
    findAllDto: FindAllEntityDto,
    user_id: Types.ObjectId,
  ): Promise<IPagination<Entity>>;
}
