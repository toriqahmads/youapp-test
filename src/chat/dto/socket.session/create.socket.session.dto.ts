import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSocketSessionDto {
  @IsString()
  @ApiProperty()
  user_id: string;

  @IsString()
  @ApiProperty()
  socket_id: string;
}
