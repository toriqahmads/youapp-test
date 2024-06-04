import { UpsertProfileUserDto } from 'src/user/dto/upsert.profile.dto';
import { IBaseService } from './base.service.interface';
import { IProfileEntity } from '../entity/profile.entity.interface';

export interface IUserService<
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
  upsertProfile(
    id: string,
    usertProfileUserDto: UpsertProfileUserDto,
  ): Promise<IProfileEntity>;
  findByUsernameOrEmail(username_or_email: string): Promise<Entity>;
  findByEmail(email: string): Promise<Entity>;
  findByIdWithFullDetail(id: string): Promise<Entity>;
  isUsernameDuplicate(username: string): Promise<boolean>;
  isEmailDuplicate(email: string): Promise<boolean>;
}
