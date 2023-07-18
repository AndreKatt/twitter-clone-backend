import { NotFoundException } from '@nestjs/common/exceptions';
import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';

import { CurrentUserEmail } from 'src/decorators/user-email.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { CreateTweetDto } from './dto/createTweet.dto';
import { TWEET_NOT_FOUD } from './tweet.constants';
import { TweetService } from './tweet.service';
import { CurrentUsername } from 'src/decorators/user-username.decorator copy';

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

  @Get('byEmail/:email')
  async findByEmail(@Param('email') email: string) {
    const userTweets = await this.tweetService.findTweetByEmail(email);
    if (!userTweets) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
    return userTweets;
  }

  @UseGuards(JwtAuthGuard)
  @Post('addTweet')
  async create(@Body() dto: CreateTweetDto) {
    return this.tweetService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @CurrentUserEmail() email: string,
    @CurrentUsername() username: string,
    @Body() dto: CreateTweetDto,
  ) {
    const verifyAndFindEmail = await this.tweetService.verify(
      id,
      email,
      username,
    );
    if (!verifyAndFindEmail) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
    const updated = this.tweetService.update(id, dto);
    if (!updated) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
    return updated;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUserEmail() email: string,
    @CurrentUsername() username: string,
  ) {
    const verify = await this.tweetService.verify(id, email, username);
    if (!verify) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
    return this.tweetService.delete(id);
  }
}
