import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register';
import { LoginByRefreshTokenDto } from '../dto/login-by-refresh-token.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/shared/guard/local-auth.guard';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';

@ApiTags('AUTH')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() register: RegisterDto) {
    return this.authService.register(register);
  }

  @ApiBody({
    schema: {
      properties: {
        username_or_email: {
          type: 'string',
          title: 'username or email',
          example: 'test / test@gmail.com',
        },
        password: {
          type: 'string',
          title: 'password',
          example: 'password123',
        },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const { user } = req;
    return this.authService.login(user);
  }

  @Post('login/refresh-token')
  async loginByRefreshToken(@Body() refresh_token: LoginByRefreshTokenDto) {
    return this.authService.loginByRefreshToken(refresh_token.refresh_token);
  }

  @ApiBearerAuth()
  @Get('authenticated')
  @UseGuards(JwtAuthGuard)
  async getAuthenticated(@Request() req) {
    return req.user;
  }

  @ApiBearerAuth()
  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }
}
