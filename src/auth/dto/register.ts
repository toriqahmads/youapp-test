import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
  })
  email: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  username: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  password: string;
}
