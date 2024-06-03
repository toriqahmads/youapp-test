import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { ChatService } from '../service/chat.service';
import { FindallChatDto } from '../dto/chat/findall.chat.dto';
import { SendMessageDto } from '../dto/chat/send.message.dto';

@ApiTags('CHAT')
@ApiBearerAuth()
@Controller({
  path: 'chat',
  version: '1',
})
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  sendMessage(@Body() sendMessageDto: SendMessageDto, @Request() req) {
    return this.chatService.sendMessage(sendMessageDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllMyChat(@Query() filter: FindallChatDto, @Request() req) {
    return this.chatService.findMyChats(filter, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  destroy(@Param('id') id: string) {
    return this.chatService.destroy(id);
  }
}
