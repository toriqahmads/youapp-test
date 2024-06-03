import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindallMessageDto {
  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  chat_id?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  from?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  message?: string;
}
