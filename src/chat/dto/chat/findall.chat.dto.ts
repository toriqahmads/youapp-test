import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindallChatDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  limit?: number;

  @IsString({
    each: true,
  })
  @IsOptional()
  @ApiPropertyOptional()
  participants?: string[];

  @IsString()
  @IsOptional()
  recipient_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  chat_name?: string;

  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  is_group?: boolean;
}
