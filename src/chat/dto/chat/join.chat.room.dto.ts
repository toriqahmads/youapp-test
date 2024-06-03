import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JoinChatRoomDto {
  @IsString()
  @ApiProperty()
  chat_id: string;
}
