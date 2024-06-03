import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { CreateMessageDto } from '../message/create.message.dto';

export class SendMessageDto extends OmitType(CreateMessageDto, [
  'chat_id',
  'sender',
]) {
  @IsString()
  @ApiProperty()
  recipient: string;
}
