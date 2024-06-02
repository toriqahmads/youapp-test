import { ObjectId } from 'mongoose';
import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';

export interface IBaseService<
  Entity,
  CreateEntityDto,
  UpdateEntityDto,
  FindAllEntityDto,
> {
  create(createDto: CreateEntityDto): Promise<Entity>;
  update(
    id: number | string | ObjectId,
    updateDto: UpdateEntityDto,
  ): Promise<Entity>;
  findAll(findAllDto: FindAllEntityDto): Promise<IPagination<Entity>>;
  findOne(id: number | string | ObjectId): Promise<Partial<Entity>>;
  destroy(id: number | string | ObjectId): Promise<Partial<Entity>>;
}
