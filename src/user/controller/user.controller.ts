import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create.user.dto';
import { UpdateUserDto } from '../dto/update.user.dto';
import { UpsertProfileUserDto } from '../dto/upsert.profile.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';
import { FindallUserDto } from '../dto/findall.user.dto';
import { JwtAuthGuard } from 'src/shared/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
} from 'src/shared/helpers/upload/upload';

@ApiTags('USER')
@ApiBearerAuth()
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiExcludeEndpoint()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() filter: FindallUserDto) {
    return this.userService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findByIdWithFullDetail(id);
  }

  @ApiConsumes('multipart/form-data')
  @Post('/profile')
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
  upsertProfile(
    @Request() req,
    @Body() upsertProfileUserDto: UpsertProfileUserDto,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    if (banner) {
      upsertProfileUserDto.cover = `/banner/${banner.filename}`;
    }
    return this.userService.upsertProfile(req.user.id, upsertProfileUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
