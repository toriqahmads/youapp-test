import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginByRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZTAwMmFmOTRlZTgwODYwZjFhMmZlNyIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpc19hY3RpdmUiOmZhbHNlLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTY1ODkzODI3MSwiZXhwIjoxNjU5NjI5NDcxfQ.ujxDn2xcjCWfYfrDFsLMzMEt0kVTjH-YB_Bma5gwaxs',
  })
  refresh_token: string;
}
