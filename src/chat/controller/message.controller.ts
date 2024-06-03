import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { MessageService } from '../service/message.service';
import { FindallMessageDto } from '../dto/message/findall.message.dto';
import { UpdateMessageDto } from '../dto/message/update.message.dto';

@ApiTags('MESSAGE')
@ApiBearerAuth()
@Controller({
  path: 'message',
  version: '1',
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllMyMessages(@Query() filter: FindallMessageDto, @Request() req) {
    return this.messageService.findMyMessages(filter, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  readMessage(@Param('id') id: string, @Request() req) {
    return this.messageService.readMessage(id, [req.user.id]);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  destroy(@Param('id') id: string) {
    return this.messageService.destroy(id);
  }
}
