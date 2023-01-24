import {
  Controller,
  Get,
  Post,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  Body,
  HttpCode,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';

import { UserService } from './user.service';
import { ALREADY_REGISTERED_ERROR, USER_NOT_FOUND } from './user.constants';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { BadRequestException } from '@nestjs/common/exceptions';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('index')
  async index() {
    return this.userService.index();
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async create(@Body() dto: CreateUserDto) {
    const oldUser = await this.userService.findUserByEmail(dto.email);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.userService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    await this.userService.loginUser(dto);
    return this.userService.loginWithJWT(dto);
  }

  @Get('verify')
  async verify(@Query('hash') hash: string) {
    return this.userService.verifyUserByHash(hash);
  }

  @Get('byUser/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedUser = this.userService.delete(id);
    if (!deletedUser) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
