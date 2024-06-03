import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create.message.dto';

export class UpdateMessageDto extends PartialType(
  OmitType(CreateMessageDto, [
    'chat_id',
    'reads',
    'reply_for_message',
    'delivereds',
  ]),
) {}
