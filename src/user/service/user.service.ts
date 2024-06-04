import { hash } from 'bcrypt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, PipelineStage } from 'mongoose';
import { CreateUserDto } from '../dto/create.user.dto';
import { FindallUserDto } from '../dto/findall.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { UpdateProfileUserDto } from '../dto/update.profile.dto';
import { Profile, ProfileDocument } from 'src/shared/schema/profile.schema';
import { User, UserDocument } from 'src/shared/schema/user.schema';
import { paginate } from 'src/shared/helpers/pagination/pagination.helper';
import { IPagination } from 'src/shared/helpers/pagination/pagination.interface';
import { IUserEntity } from 'src/shared/interface/entity/user.entity.interface';
import { IUserService } from 'src/shared/interface/service/user.service.interface';
import { calculateHoroscope } from 'src/shared/helpers/date/calculate.horoscope.helper';
import { calculateZodiac } from 'src/shared/helpers/date/calculate.zodiac.helper';

@Injectable()
export class UserService
  implements
    IUserService<IUserEntity, CreateUserDto, UpdateUserDto, FindallUserDto>
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const { email, username, password } = createUserDto;
      const isEmailDuplicated = await this.isEmailDuplicate(email);
      if (isEmailDuplicated) {
        throw new ConflictException(`email ${email} already registered`);
      }
      const isUsernameDuplicated = await this.isUsernameDuplicate(username);
      if (isUsernameDuplicated) {
        throw new ConflictException(`username ${username} already taken`);
      }

      const user = new this.userModel({
        email,
        username,
        password: await hash(password, 10),
      });
      await user.save();

      return Promise.resolve(user);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async isEmailDuplicate(email: string): Promise<boolean> {
    try {
      const exist = await this.userModel.countDocuments({ email });

      return Promise.resolve(exist > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async isUsernameDuplicate(username: string): Promise<boolean> {
    try {
      const exist = await this.userModel.countDocuments({ username });

      return Promise.resolve(exist > 0);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findAll(filter: FindallUserDto): Promise<IPagination<UserDocument>> {
    try {
      const { page, limit, ...filterUser } = filter;

      const pageQuery = page || 1;
      const limitQuery = limit || 25;

      const query = Object();
      Object.keys(filterUser).forEach((val: string) => {
        if (typeof filterUser[val] === 'string') {
          if (filterUser[val] && filterUser[val] !== '') {
            query[val] = {
              $regex: new RegExp(filterUser[val]),
              $options: 'i',
            };
          }
        }
        if (typeof filterUser[val] === 'number') {
          if (filterUser[val] !== undefined) {
            query[val] = Number(filterUser[val]);
          }
        }
      });

      const aggregateQuery: PipelineStage[] = [
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'profiles',
            localField: '_id',
            foreignField: 'user',
            as: 'profile',
          },
        },
        {
          $unwind: {
            path: '$profile',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            email: 1,
            username: 1,
            created_at: 1,
            updated_at: 1,
            profile: {
              display_name: 1,
              gender: 1,
              birthday: 1,
              horoscope: 1,
              zodiac: 1,
              height: 1,
              weight: 1,
              interests: 1,
              age: {
                $round: [
                  {
                    $divide: [
                      { $subtract: [new Date(), '$profile.birthday'] },
                      365.25 * 24 * 60 * 60 * 1000,
                    ],
                  },
                  1,
                ],
              },
            },
          },
        },
      ];

      const users = await this.userModel
        .aggregate(aggregateQuery)
        .limit(limitQuery * 1)
        .skip((pageQuery - 1) * limitQuery)
        .exec();

      let total_data = 0;
      if (users && users.length) {
        const total = await this.userModel
          .aggregate(aggregateQuery)
          .count('id')
          .exec();

        total_data = total[0].id;
      }

      const result = paginate<UserDocument>(
        users,
        total_data,
        pageQuery,
        limitQuery,
      );

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByIdWithFullDetail(id: string): Promise<UserDocument> {
    try {
      const aggregateQuery: PipelineStage[] = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'profiles',
            localField: '_id',
            foreignField: 'user',
            as: 'profile',
          },
        },
        {
          $unwind: {
            path: '$profile',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id',
            email: 1,
            username: 1,
            created_at: 1,
            updated_at: 1,
            profile: {
              display_name: 1,
              gender: 1,
              birthday: 1,
              horoscope: 1,
              zodiac: 1,
              height: 1,
              weight: 1,
              interests: 1,
              age: {
                $round: [
                  {
                    $divide: [
                      { $subtract: [new Date(), '$profile.birthday'] },
                      365.25 * 24 * 60 * 60 * 1000,
                    ],
                  },
                  1,
                ],
              },
            },
          },
        },
      ];

      const user = await this.userModel.aggregate(aggregateQuery).exec();
      if (!user || user.length < 1) {
        throw new NotFoundException(`user with id ${id} not found`);
      }

      return Promise.resolve(user[0]);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException(`user with email ${email} not found`);
      }

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByUsernameOrEmail(
    username_or_email: string,
  ): Promise<UserDocument> {
    try {
      const user = await this.userModel.findOne({
        $or: [{ username: username_or_email }, { email: username_or_email }],
      });
      if (!user) {
        throw new NotFoundException(
          `user with username or email ${username_or_email} not found`,
        );
      }

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const { email, username, password } = updateUserDto;

      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`user with id ${id} not found`);
      }
      if (email && email !== '' && email !== user.email) {
        const isDuplicate = await this.isEmailDuplicate(email);
        if (isDuplicate) {
          throw new ConflictException(`email ${email} already registered`);
        }

        user.email = email;
      }
      if (username && username !== '' && username !== user.username) {
        const isDuplicate = await this.isUsernameDuplicate(username);
        if (isDuplicate) {
          throw new ConflictException(
            `username ${username} already registered`,
          );
        }

        user.username = username;
      }
      if (password) {
        user.password = await hash(password, 10);
      }

      await user.save();
      const result = await this.findOne(id);

      return Promise.resolve(result);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async destroy(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`user with id ${id} not found`);
      }

      await user.deleteOne();
      const result = await this.findOne(id);

      return Promise.resolve(result);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async upsertProfile(
    id: string,
    updateProfileUserDto: UpdateProfileUserDto,
  ): Promise<ProfileDocument> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException(`user with id ${id} not found`);
      }

      if (updateProfileUserDto.birthday) {
        updateProfileUserDto.horoscope = calculateHoroscope(
          updateProfileUserDto.birthday,
        );
        updateProfileUserDto.zodiac = calculateZodiac(
          updateProfileUserDto.birthday,
        );
      }

      const isProfileExist = await this.profileModel.findOne({
        user: user.id,
      });

      if (isProfileExist) {
        if (!updateProfileUserDto.birthday && isProfileExist.birthday) {
          updateProfileUserDto.birthday = isProfileExist.birthday;
        }

        updateProfileUserDto.horoscope = calculateHoroscope(
          updateProfileUserDto.birthday,
        );

        updateProfileUserDto.zodiac = calculateZodiac(
          updateProfileUserDto.birthday,
        );

        await this.profileModel.updateOne(
          {
            user: user.id,
          },
          updateProfileUserDto,
        );
      } else {
        await this.profileModel.create({ ...updateProfileUserDto, user });
      }

      const result = await this.profileModel.findOne({ user: user.id });

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
