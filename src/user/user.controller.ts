import { Controller, Get, Post } from '@nestjs/common';
import { Body, HttpCode } from '@nestjs/common/decorators';
import { CreateUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  @Get('index')
  async index(@Body() dto: CreateUserDto[]) {}

  @Post('create')
  async create(@Body() dto: CreateUserDto) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: CreateUserDto) {}
}
