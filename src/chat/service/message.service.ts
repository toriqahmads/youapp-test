import { Model, PipelineStage, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from 'src/shared/schema/chat.schema';
import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';
import { paginate } from 'src/shared/helpers/pagination/pagination.helper';
import { IMessageService } from 'src/shared/interface/service/message.service.interface';
import { IMessageEntity } from 'src/shared/interface/entity/message.entity.interface';
import { CreateMessageDto } from '../dto/message/create.message.dto';
import { UpdateMessageDto } from '../dto/message/update.message.dto';
import { FindallMessageDto } from '../dto/message/findall.message.dto';
import { Message, MessageDocument } from 'src/shared/schema/message.schema';
import { IUserEntity } from 'src/shared/interface/entity/user.entity.interface';

@Injectable()
export class MessageService
  implements
    IMessageService<
      IMessageEntity,
      CreateMessageDto,
      UpdateMessageDto,
      FindallMessageDto
    >
{
  constructor(
    @InjectModel(Chat.name)
    private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  async create(createDto: CreateMessageDto): Promise<MessageDocument> {
    try {
      const message = await this.messageModel.create({
        ...createDto,
        sender: createDto.sender,
        chat: createDto.chat_id,
        reply_for_message: createDto.reply_for_message,
      });

      return Promise.resolve(message);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async update(
    id: string | number | Types.ObjectId,
    updateDto: UpdateMessageDto,
  ): Promise<MessageDocument> {
    try {
      const message = await this.messageModel.findById(id);
      if (!message) {
        throw new NotFoundException(`message with id ${id} is not found`);
      }

      if (updateDto.body) message.body = updateDto.body;
      if (updateDto.type) message.type = updateDto.type;
      if (updateDto.attachments) message.attachments = updateDto.attachments;

      await message.save();

      return Promise.resolve(message);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async readMessage(
    id: string | number | Types.ObjectId,
    reads_by: Array<Types.ObjectId>,
  ): Promise<MessageDocument> {
    try {
      const message = await this.messageModel.findById(id);
      if (!message) {
        throw new NotFoundException(`message with id ${id} is not found`);
      }

      const parseReadBy = reads_by.map((rb) => {
        return {
          by: rb as unknown as Partial<IUserEntity>,
          time: new Date(),
        };
      });

      message.reads.push(...parseReadBy);
      await message.save();

      return Promise.resolve(message);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deliveredMessage(
    id: string | number | Types.ObjectId,
    delivereds_to: Array<Types.ObjectId>,
  ): Promise<MessageDocument> {
    try {
      const message = await this.messageModel.findById(id);
      if (!message) {
        throw new NotFoundException(`message with id ${id} is not found`);
      }

      const parseDeliveredTo = delivereds_to.map((dt) => {
        return {
          by: dt as unknown as Partial<IUserEntity>,
          time: new Date(),
        };
      });

      message.delivereds.push(...parseDeliveredTo);
      await message.save();

      return Promise.resolve(message);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _findAllDto: FindallMessageDto,
  ): Promise<IPagination<MessageDocument>> {
    throw new Error(`Method not implemented.`);
  }

  async findOne(
    id: string | number | Types.ObjectId,
  ): Promise<Partial<MessageDocument>> {
    try {
      const chat = await this.messageModel.findById(id);

      return Promise.resolve(chat);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMyMessages(
    findAllDto: FindallMessageDto,
    user_id: Types.ObjectId,
  ): Promise<IPagination<MessageDocument>> {
    try {
      const { page, limit, ...filterMessage } = findAllDto;

      const pageQuery = page || 1;
      const limitQuery = limit || 25;

      const query = Object();
      if (filterMessage.message) {
        query['body'] = {
          $regex: new RegExp(filterMessage.message),
          $options: 'i',
        };
      }
      if (filterMessage.chat_id) {
        query['chat'] = new Types.ObjectId(filterMessage.chat_id);
      }

      const aggregateQuery: PipelineStage[] = [
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'chats',
            localField: 'chat',
            foreignField: '_id',
            as: 'chat',
          },
        },
        {
          $unwind: {
            path: '$chat',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            'chat.participants': {
              $all: [new Types.ObjectId(user_id.toString())],
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            body: 1,
            type: 1,
            attatchments: 1,
            created_at: 1,
            updated_at: 1,
          },
        },
      ];

      const messages = await this.messageModel
        .aggregate(aggregateQuery)
        .limit(limitQuery * 1)
        .skip((pageQuery - 1) * limitQuery)
        .exec();

      let total_data = 0;
      if (messages && messages.length) {
        const total = await this.messageModel
          .aggregate(aggregateQuery)
          .count('id')
          .exec();

        total_data = total[0].id;
      }

      const result = paginate<MessageDocument>(
        messages,
        total_data,
        pageQuery,
        limitQuery,
      );

      return Promise.resolve(result);
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  async destroy(
    id: string | number | Types.ObjectId,
  ): Promise<Partial<MessageDocument>> {
    try {
      const message = await this.messageModel.findById(id);
      if (!message) {
        throw new NotFoundException(`message with id ${id} is not found`);
      }

      await message.deleteOne();

      return Promise.resolve(message);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
