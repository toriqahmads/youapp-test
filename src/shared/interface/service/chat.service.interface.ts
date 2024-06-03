import { Types } from 'mongoose';
import { IBaseService } from './base.service.interface';
import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';
import { SendMessageDto } from 'src/chat/dto/chat/send.message.dto';
import { SendMessageEntity } from '../entity/chat.entity.interface';

export interface IChatService<
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
  findMyChats(
    findAllDto: FindAllEntityDto,
    user_id: Types.ObjectId,
  ): Promise<IPagination<Entity>>;
  sendMessage(
    sendMessageDto: SendMessageDto,
    sender: Types.ObjectId,
  ): Promise<SendMessageEntity>;
}
