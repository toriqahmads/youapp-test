import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsString({
    each: true,
  })
  @ApiProperty()
  participants: string[];

  recipient_id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  chat_name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  is_group?: boolean = false;
}
