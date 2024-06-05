import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from 'src/shared/enum/gender.enum';

export class UpsertProfileUserDto {
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

  @ApiPropertyOptional({ type: 'string', format: 'binary', required: true })
  @IsOptional()
  banner?: Express.Multer.File;
  cover?: string;

  @IsString({
    each: true,
  })
  @Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return String(value)
        .split(',')
        .map((v: string) => v.trim());
    } else {
      return value;
    }
  })
  @IsOptional()
  @ApiPropertyOptional()
  interests?: string[];
}
