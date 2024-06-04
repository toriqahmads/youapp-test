import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from '../enum/gender.enum';
import { User } from './user.schema';
import { IProfileEntity } from '../interface/entity/profile.entity.interface';
import { calculateAge } from '../helpers/date/calculate.age.helper';

export type ProfileDocument = Profile & Document;

@Schema({
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    getters: true,
    virtuals: true,
    transform(doc, ret) {
      if (ret._id) {
        ret.id = ret._id;
        delete ret._id;
      }
    },
  },
  toObject: {
    getters: true,
    virtuals: true,
  },
})
export class Profile implements IProfileEntity {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    unique: true,
  })
  user: User;

  @Prop()
  display_name: string;

  @Prop()
  gender: Gender;

  @Prop()
  birthday: Date;

  @Prop({ default: null })
  horoscope: string;

  @Prop({ default: null })
  zodiac: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop()
  cover: string;

  @Prop()
  interests: string[];

  age: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.virtual('age').get(function () {
  return calculateAge(this.birthday);
});
