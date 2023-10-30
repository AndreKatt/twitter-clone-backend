import { NotFoundException } from '@nestjs/common/exceptions';
import { Controller, Get, Post, Delete } from '@nestjs/common';
import { Body, Param, UseGuards } from '@nestjs/common/decorators';
// local libs
import { ReplyService } from './reply.service';
import { TweetService } from 'src/tweet/tweet.service';
import { TWEET_NOT_FOUD } from 'src/tweet/tweet.constants';
import { REPLY_NOT_FOUD } from './reply.constants';
import { USER_NOT_FOUND } from 'src/user/user.constants';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { CurrentUserEmail } from 'src/decorators/user-email.decorator';
import { CurrentUsername } from 'src/decorators/user-username.decorator';
import { CreateReplyDto } from './dto/createReply.dto';

@Controller('replies')
export class ReplyController {
  constructor(
    private readonly replyService: ReplyService,
    private readonly tweetService: TweetService,
  ) {}

  @Get('index')
  async index() {
    return this.replyService.index();
  }

  @Get('byReply/:id')
  async findById(@Param('id') id: string) {
    const findReply = await this.replyService.findReplyById(id);

    if (!findReply) {
      throw new NotFoundException(REPLY_NOT_FOUD);
    }
    return findReply;
  }

  @Get('byPublication/:id')
  async findByPublicationId(@Param('id') id: string) {
    const tweet = await this.tweetService.findTweetById(id);

    if (tweet) {
      const findReplies = await this.replyService.findByPublicationId(
        tweet.replies,
      );

      if (!findReplies) {
        throw new NotFoundException(REPLY_NOT_FOUD);
      }
      return findReplies;
    } else {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
  }

  @Get('byUser/:email')
  async findByUser(@Param('email') email: string) {
    const findReplies = await this.replyService.findByUserEmail(email);

    if (!findReplies) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return findReplies;
  }

  @UseGuards(JwtAuthGuard)
  @Post('addReply/:id')
  async create(@Param('id') id: string, @Body() dto: CreateReplyDto) {
    const reply = await this.replyService.create(dto);
    await this.tweetService.action(id, 'replies', reply.id);

    return reply;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUserEmail() email: string,
    @CurrentUsername() username: string,
  ) {
    const verify = await this.replyService.verify(id, email, username);
    if (!verify) {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
    return this.replyService.delete(id);
  }
}
