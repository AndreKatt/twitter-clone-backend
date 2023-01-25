import { NotFoundException } from '@nestjs/common/exceptions';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';

import { CurrentUserEmail } from '../decorators/user-email.decorator';
import { JwtAuthGuard } from '../user/guards/jwt.guard';
import { CreateTweetDto } from './dto/createTweet.dto';
import { TWEET_NOT_FOUD } from './tweet.constants';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get('index')
  async index() {
    return this.tweetService.index();
  }

  @Get('byTweet/:id')
  async findById(@Param('id') id: string) {
    const findTweet = await this.tweetService.findTweetById(id);
    if (!findTweet) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
    return findTweet;
  }

  @UseGuards(JwtAuthGuard)
  @Post('addTweet')
  async create(@Body() dto: CreateTweetDto) {
    return this.tweetService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUserEmail() email: string) {
    const deleteTweet = await this.tweetService.delete(id, email);
    if (!deleteTweet) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
  }
}
