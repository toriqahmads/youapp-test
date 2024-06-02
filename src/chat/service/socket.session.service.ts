import { Model, Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ISocketSessionService } from 'src/shared/interface/service/socket.session.service.interface';
import { ISocketSessionEntity } from 'src/shared/interface/entity/socket.session.entity.interface';
import {
  SocketSession,
  SocketSessionDocument,
} from 'src/shared/schema/socket.session.schema';
import { CreateSocketSessionDto } from '../dto/socket.session/create.socket.session.dto';
import { UpdateSocketSessionDto } from '../dto/socket.session/update.socket.session.dto';
import { FindallSocketSessionDto } from '../dto/socket.session/findall.socket.session.dto';
import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';

@Injectable()
export class SocketSessionService
  implements
    ISocketSessionService<
      ISocketSessionEntity,
      CreateSocketSessionDto,
      UpdateSocketSessionDto,
      FindallSocketSessionDto
    >
{
  constructor(
    @InjectModel(SocketSession.name)
    private readonly socketModel: Model<SocketSession>,
  ) {}

  async create(
    createDto: CreateSocketSessionDto,
  ): Promise<ISocketSessionEntity> {
    try {
      const session = await this.findByUserId(createDto.user_id);
      if (session) {
        await this.socketModel.updateOne(
          { user: createDto.user_id },
          createDto,
        );
      } else {
        await this.socketModel.create({
          ...createDto,
          user: createDto.user_id,
        });
      }

      return await this.findByUserId(createDto.user_id);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async update(
    id: string | number | Schema.Types.ObjectId,
    updateDto: UpdateSocketSessionDto,
  ): Promise<ISocketSessionEntity> {
    try {
      let session = await this.socketModel.findById(id);
      if (session) {
        if (updateDto.socket_id) session.socket_id = updateDto.socket_id;
        await session.save();
      } else {
        session = await this.socketModel.create(updateDto);
      }

      return Promise.resolve(session);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findAll(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _findAllDto: FindallSocketSessionDto,
  ): Promise<IPagination<ISocketSessionEntity>> {
    throw new Error('Method not implemented.');
  }

  async findOne(
    id: string | number | Schema.Types.ObjectId,
  ): Promise<Partial<ISocketSessionEntity>> {
    try {
      const session = await this.socketModel.findOne({ id });

      return Promise.resolve(session);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async destroy(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _id: string | number | Schema.Types.ObjectId,
  ): Promise<Partial<ISocketSessionEntity>> {
    throw new Error('Method not implemented.');
  }

  async destroyBySocketId(
    socket_id: string,
  ): Promise<Partial<ISocketSessionEntity>> {
    try {
      const session = await this.findBySocketId(socket_id);
      await this.socketModel.deleteOne({ socket_id });

      return Promise.resolve(session);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByUserId(
    user_id: string | number | Schema.Types.ObjectId,
  ): Promise<SocketSessionDocument> {
    try {
      const session = await this.socketModel.findOne({ user: user_id });

      return Promise.resolve(session);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findBySocketId(socket_id: string): Promise<SocketSessionDocument> {
    try {
      const session = await this.socketModel.findOne({ socket_id });

      return Promise.resolve(session);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
