import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindallSocketSessionDto {
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
  user_id?: string;
}
