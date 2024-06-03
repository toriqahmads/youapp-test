import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/shared/enum/gender.enum';

export class UpdateProfileUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  display_name?: string;

  @IsDateString()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  birthday?: Date;

  @IsString()
  @IsIn(Object.values(Gender))
  @IsOptional()
  @ApiPropertyOptional({
    enum: Gender,
    enumName: 'Gender',
  })
  gender?: string;

  horoscope?: string;

  zodiac?: string;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  height?: number;

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  weight?: number;

  cover?: string;

  @IsString({
    each: true,
  })
  @IsOptional()
  @ApiPropertyOptional()
  interests?: string[];
}
