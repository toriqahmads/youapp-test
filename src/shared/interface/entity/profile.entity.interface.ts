import { Gender } from 'src/shared/enum/gender.enum';
import { IBaseEntity } from './base.entity.interface';
import { IUserEntity } from './user.entity.interface';

export interface IProfileEntity extends IBaseEntity {
  user?: Partial<IUserEntity>;
  display_name: string;
  gender: Gender;
  birthday: Date;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  cover: string;
  interests: string[];
  age?: number;
}
