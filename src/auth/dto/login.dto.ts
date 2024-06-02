import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({
    type: String,
  })
  username_or_email: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  password: string;
}
