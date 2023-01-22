import {
  Controller,
  Get,
  Post,
  Delete,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  Body,
  HttpCode,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { query } from 'express';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { generateMD5 } from 'src/utils/generateHash';

import { CreateUserDto } from './dto/createUser.dto';
import { sendEmail } from './sendMail';
import { PASSWORDS_ARE_NOT_EQUAL, USER_NOT_FOUND } from './user.constants';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('index')
  async index() {
    return this.userService.index();
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: CreateUserDto) {}

  @Get('verify')
  async verify(@Query('hash') hash: string) {
    return this.userService.verifyUserByHash(hash);
  }

  @Get('byUser/:userId')
  async getByUser(@Param('userId') userId: string) {
    return this.userService.findUserById(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedUser = this.userService.delete(id);
    if (!deletedUser) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
