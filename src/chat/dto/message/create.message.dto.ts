import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, IsUrl } from 'class-validator';
import { MessageType } from 'src/shared/enum/message.enum';
import {
  IDeliveredMessage,
  IReadMessage,
} from 'src/shared/interface/entity/message.entity.interface';

export class CreateMessageDto {
  @IsString()
  @ApiProperty()
  chat_id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  body: string;

  @IsString()
  @IsIn(Object.values(MessageType))
  @IsOptional()
  @ApiPropertyOptional({
    enum: Object.values(MessageType),
    enumName: 'message type',
    default: MessageType.TEXT,
  })
  type?: MessageType = MessageType.TEXT;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'fill with message id for replying a message',
  })
  reply_for_message?: string;

  @IsUrl({}, { each: true })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'list of attachment url',
  })
  attachments?: string[];

  sender?: string;
  delivereds?: Array<IDeliveredMessage>;
  reads?: Array<IReadMessage>;
}
