import { Types } from 'mongoose';
import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';

export interface IBaseService<
  Entity,
  CreateEntityDto,
  UpdateEntityDto,
  FindAllEntityDto,
> {
  create(createDto: CreateEntityDto): Promise<Entity>;
  update(
    id: number | string | Types.ObjectId,
    updateDto: UpdateEntityDto,
  ): Promise<Entity>;
  findAll(findAllDto: FindAllEntityDto): Promise<IPagination<Entity>>;
  findOne(id: number | string | Types.ObjectId): Promise<Partial<Entity>>;
  destroy(id: number | string | Types.ObjectId): Promise<Partial<Entity>>;
}
