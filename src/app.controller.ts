import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { AuthService } from './auth/service/auth.service';
import { RegisterDto } from './auth/dto/register';
import { LocalAuthGuard } from './shared/guard/local-auth.guard';
import { JwtAuthGuard } from './shared/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from './shared/helpers/upload/upload';
import { UpsertProfileUserDto } from './user/dto/upsert.profile.dto';
import { UserService } from './user/service/user.service';
import { MessageService } from './chat/service/message.service';
import { FindallMessageDto } from './chat/dto/message/findall.message.dto';
import { SendMessageDto } from './chat/dto/chat/send.message.dto';
import { ChatService } from './chat/service/chat.service';
import { FindallChatDto } from './chat/dto/chat/findall.chat.dto';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  @Get('healthCheck')
  healthCheck(): string {
    return 'ok';
  }

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

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('createProfile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './public/banner',
        filename: editFileName,
      }),
      limits: {
        fileSize: 1000 * 1000,
      },
      fileFilter: imageFileFilter,
    }),
  )
  createProfile(
    @Request() req,
    @Body() createProfileUserDto: UpsertProfileUserDto,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    if (banner) {
      createProfileUserDto.cover = `/banner/${banner.filename}`;
    }
    return this.userService.upsertProfile(req.user.id, createProfileUserDto);
  }

  @ApiBearerAuth()
  @Get('getProfile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.userService.findByIdWithFullDetail(req.user.id);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Put('updateProfile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './public/banner',
        filename: editFileName,
      }),
      limits: {
        fileSize: 1000 * 1000,
      },
      fileFilter: imageFileFilter,
    }),
  )
  updateProfile(
    @Request() req,
    @Body() createProfileUserDto: UpsertProfileUserDto,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    if (banner) {
      createProfileUserDto.cover = `/banner/${banner.filename}`;
    }
    return this.userService.upsertProfile(req.user.id, createProfileUserDto);
  }

  @ApiBearerAuth()
  @Get('viewChats')
  @UseGuards(JwtAuthGuard)
  viewChats(@Query() filter: FindallChatDto, @Request() req) {
    return this.chatService.findMyChats(filter, req.user.id);
  }

  @ApiBearerAuth()
  @Get('viewMessages')
  @UseGuards(JwtAuthGuard)
  viewMessages(@Query() filter: FindallMessageDto, @Request() req) {
    return this.messageService.findMyMessages(filter, req.user.id);
  }

  @ApiBearerAuth()
  @Post('sendMessage')
  @UseGuards(JwtAuthGuard)
  sendMessage(@Body() sendMessageDto: SendMessageDto, @Request() req) {
    return this.chatService.sendMessage(sendMessageDto, req.user.id);
  }
}
