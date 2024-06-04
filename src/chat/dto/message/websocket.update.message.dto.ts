import { ApiProperty } from '@nestjs/swagger';
import { UpdateMessageDto } from './update.message.dto';
import { IsString } from 'class-validator';

export class WebsocketUpdateMessageDto extends UpdateMessageDto {
  @IsString()
  @ApiProperty()
  message_id: string;
}
