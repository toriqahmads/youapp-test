import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindallUserDto {
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
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;
}
