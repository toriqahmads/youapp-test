import { Model, PipelineStage, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from 'src/shared/schema/chat.schema';
import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';
import { IChatService } from 'src/shared/interface/service/chat.service.interface';
import {
  IChatEntity,
  SendMessageEntity,
} from 'src/shared/interface/entity/chat.entity.interface';
import { CreateChatDto } from '../dto/chat/create.chat.dto';
import { UpdateChatDto } from '../dto/chat/update.chat.dto';
import { FindallChatDto } from '../dto/chat/findall.chat.dto';
import { IUserEntity } from 'src/shared/interface/entity/user.entity.interface';
import { paginate } from 'src/shared/helpers/pagination/pagination.helper';
import { MessageService } from './message.service';
import { UserService } from 'src/user/service/user.service';
import { SendMessageDto } from '../dto/chat/send.message.dto';
import { CreateMessageDto } from '../dto/message/create.message.dto';

@Injectable()
export class ChatService
  implements
    IChatService<IChatEntity, CreateChatDto, UpdateChatDto, FindallChatDto>
{
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<Chat>,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  async sendMessage(
    sendMessageDto: SendMessageDto,
    sender: Types.ObjectId,
  ): Promise<SendMessageEntity> {
    try {
      const { recipient } = sendMessageDto;
      const participants = [sender.toString()];
      const createMessage: CreateMessageDto = {
        body: sendMessageDto.body,
        type: sendMessageDto.type,
        attachments: sendMessageDto.attachments,
        reply_for_message: sendMessageDto.reply_for_message,
        sender: sender.toString(),
        chat_id: '',
      };

      const isToUser = await this.userService.findOne(recipient);
      if (isToUser) participants.push(recipient);

      let chat = await this.findChatForSendingMessage(
        new Types.ObjectId(recipient),
        isToUser ? sender : null,
      );

      if (!chat) {
        chat = await this.create({
          participants,
          recipient_id: isToUser
            ? `${sender.toString()}_${recipient}`
            : recipient,
          is_group: isToUser ? false : true,
        });
      }

      createMessage.chat_id = chat.id.toString();
      const message = await this.messageService.create(createMessage);

      return Promise.resolve({ chat, message });
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async create(createDto: CreateChatDto): Promise<ChatDocument> {
    try {
      const chat = await this.chatModel.create({
        ...createDto,
        participants: createDto.participants,
      });

      return Promise.resolve(chat);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async update(
    id: string | number | Types.ObjectId,
    updateDto: UpdateChatDto,
  ): Promise<ChatDocument> {
    try {
      const chat = await this.chatModel.findById(id);
      if (!chat) {
        throw new NotFoundException(`chat with id ${id} is not found`);
      }

      if (updateDto.chat_name) chat.chat_name = updateDto.chat_name;
      if (updateDto.is_group !== undefined) chat.is_group = updateDto.is_group;
      if (updateDto.participants) {
        chat.participants = updateDto.participants as Array<
          Partial<IUserEntity>
        >;
      }

      await chat.save();

      return Promise.resolve(chat);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _findAllDto: FindallChatDto,
  ): Promise<IPagination<ChatDocument>> {
    throw new Error(`Method not implemented.`);
  }

  async findOne(
    id: string | number | Types.ObjectId,
  ): Promise<Partial<ChatDocument>> {
    try {
      const chat = await this.chatModel.findById(id);

      return Promise.resolve(chat);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findChatForSendingMessage(
    recipient: Types.ObjectId,
    sender?: Types.ObjectId,
  ): Promise<ChatDocument> {
    try {
      let recipient_id = recipient.toString();
      let recipient_id_reverse = recipient.toString();
      if (sender) {
        recipient_id = `${sender.toString()}_${recipient.toString()}`;
        recipient_id_reverse = `${recipient.toString()}_${sender.toString()}`;
      }

      const chat = await this.chatModel.findOne({
        $or: [
          {
            recipient_id: recipient_id,
          },
          {
            recipient_id: recipient_id_reverse,
          },
        ],
      });

      return Promise.resolve(chat);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMyChats(
    findAllDto: FindallChatDto,
    user_id: Types.ObjectId,
  ): Promise<IPagination<ChatDocument>> {
    try {
      const { page, limit, ...filterChat } = findAllDto;

      const pageQuery = page || 1;
      const limitQuery = limit || 25;

      if (!filterChat.participants) filterChat.participants = [];
      if (filterChat.participants && !Array.isArray(filterChat.participants)) {
        filterChat.participants = [filterChat.participants];
      }
      filterChat.participants.push(user_id.toString());

      const query = Object();
      if (filterChat.chat_name) {
        query['chat_name'] = {
          $regex: new RegExp(filterChat.chat_name),
          $options: 'i',
        };
      }
      if (filterChat.is_group !== undefined) {
        const is_group_boolean =
          String(filterChat.is_group).toLowerCase() === 'true';
        query['is_group'] = is_group_boolean;
      }
      if (filterChat.participants) {
        query['participants'] = {
          $all: filterChat.participants.map(
            (p) => new Types.ObjectId(p.trim()),
          ),
        };
      }
      if (filterChat.recipient_id) {
        query['recipient_id'] = {
          $regex: new RegExp(filterChat.recipient_id),
          $options: 'i',
        };
      }

      const aggregateQuery: PipelineStage[] = [
        {
          $match: query,
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            chat_name: 1,
            is_group: 1,
            participants: 1,
            created_at: 1,
            updated_at: 1,
          },
        },
      ];

      const chats = await this.chatModel
        .aggregate(aggregateQuery)
        .limit(limitQuery * 1)
        .skip((pageQuery - 1) * limitQuery)
        .exec();

      if (!chats || chats.length < 1) {
        throw new NotFoundException(`no chat record`);
      }

      const total_data = await this.chatModel
        .aggregate(aggregateQuery)
        .count('id')
        .exec();

      const result = paginate<ChatDocument>(
        chats,
        total_data[0].id,
        pageQuery,
        limitQuery,
      );

      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async destroy(
    id: string | number | Types.ObjectId,
  ): Promise<Partial<ChatDocument>> {
    try {
      const chat = await this.chatModel.findById(id);
      if (!chat) {
        throw new NotFoundException(`chat with id ${id} is not found`);
      }

      await chat.deleteOne();

      return Promise.resolve(chat);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
