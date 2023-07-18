import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  Body,
  HttpCode,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';

import {
  ALREADY_FOLLOW_ERROR,
  ALREADY_REGISTERED_ERROR,
  FOLLOWING_NOT_FOUND,
  USER_NOT_FOUND,
  USER_UNAUTHORIZED,
} from './user.constants';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserService } from './user.service';
import { CurrentUserEmail } from 'src/decorators/user-email.decorator';
import { CurrentUsername } from 'src/decorators/user-username.decorator copy';
import { CurrentUserFullname } from 'src/decorators/user-fullname.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('index')
  async index() {
    return this.userService.index();
  }

  @UseGuards(JwtAuthGuard)
  @Get('byUser/:email')
  async getUserByEmail(@Param('email') email: string) {
    const findUser = await this.userService.findUserByEmail(email);
    if (!findUser) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return findUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUserData(
    @CurrentUserEmail() email: string,
    @CurrentUsername() username: string,
    @CurrentUserFullname() fullname: string,
  ) {
    return this.userService.getCurrentUser(email, username, fullname);
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
    const userData = await this.userService.loginUser(dto);
    if (userData) {
      const { email, fullname, username } = userData;
      const token = await this.userService.loginWithJWT(
        email,
        fullname,
        username,
      );
      return { user: userData, token };
    }
    throw new UnauthorizedException(USER_UNAUTHORIZED);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('follow/:id')
  async follow(@Param('id') id: string, @CurrentUserEmail() email: string) {
    const alreadyFollow = await this.userService.findFollowing(email, id);
    if (alreadyFollow) {
      throw new BadRequestException(ALREADY_FOLLOW_ERROR);
    } else {
      return this.userService.addFollowing(email, id);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('unfollow/:id')
  async unfollow(@Param('id') id: string, @CurrentUserEmail() email: string) {
    const alreadyFollow = await this.userService.findFollowing(email, id);
    if (alreadyFollow) {
      return this.userService.removeFollowing(email, id);
    } else {
      throw new HttpException(FOLLOWING_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Get('verify')
  async verify(@Query('hash') hash: string) {
    const verifyUser = await this.userService.verifyUserByHash(hash);
    if (!verifyUser) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return verifyUser;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedUser = await this.userService.delete(id);
    if (!deletedUser) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
