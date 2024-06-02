import { PartialType } from '@nestjs/swagger';
import { CreateSocketSessionDto } from './create.socket.session.dto';

export class UpdateSocketSessionDto extends PartialType(
  CreateSocketSessionDto,
) {}
