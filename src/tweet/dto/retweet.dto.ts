import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { TweetUserDto } from './createTweet.dto';

export class RetweetDto {
  @Type(() => Types.ObjectId)
  tweetId: string;

  @IsString()
  text?: string;

  @Type(() => TweetUserDto)
  currentUser: TweetUserDto;
}
