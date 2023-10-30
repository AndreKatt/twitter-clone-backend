import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Controller, Get, Post, Delete, Patch } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
// local libs
import { CurrentUserEmail } from 'src/decorators/user-email.decorator';
import { CurrentUsername } from 'src/decorators/user-username.decorator';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { CreateTweetDto } from './dto/createTweet.dto';
import {
  ALREADY_LIKED_ERROR,
  LIKE_NOT_FOUND,
  TWEET_NOT_FOUD,
} from './tweet.constants';
import { TweetService } from './tweet.service';
import { UserService } from 'src/user/user.service';
import { ReplyService } from 'src/reply/reply.service';

@Controller('tweets')
export class TweetController {
  constructor(
    private readonly tweetService: TweetService,
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
  ) {}

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
    const userTweets = await this.tweetService.findTweetsByEmail(email);
    if (!userTweets) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
    return userTweets;
  }

  @UseGuards(JwtAuthGuard)
  @Post('addTweet')
  async create(@Body() dto: CreateTweetDto) {
    return await this.tweetService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('like/:id')
  async like(@Param('id') id: string, @CurrentUserEmail() email: string) {
    const alreadyLiked = await this.tweetService.findLike(id, email);

    if (alreadyLiked) {
      throw new BadRequestException(ALREADY_LIKED_ERROR);
    } else {
      await this.userService.changeLikes(id, 'like', email);

      return this.tweetService.action(id, 'likes', email);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('unlike/:id')
  async unlike(@Param('id') id: string, @CurrentUserEmail() email: string) {
    const alreadyLiked = await this.tweetService.findLike(id, email);

    if (alreadyLiked) {
      await this.userService.changeLikes(id, 'unlike', email);

      return await this.tweetService.action(id, 'likes', email, true);
    } else {
      throw new BadRequestException(LIKE_NOT_FOUND);
    }
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
    const tweet = await this.tweetService.findTweetById(id);

    if (tweet) {
      tweet.likes.forEach(
        async (email) =>
          await this.userService.changeLikes(id, 'unlike', email),
      );

      tweet.replies.forEach(async (id) => await this.replyService.delete(id));
    }
    return this.tweetService.delete(id);
  }
}
