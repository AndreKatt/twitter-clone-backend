import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';

class TweetUserDto {
  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  fullname: string;
}

export class CreateTweetDto {
  @Type(() => Types.ObjectId)
  tweetId: string;

  @MinLength(1, { message: 'Введите текст твита.' })
  @MaxLength(280, { message: 'Максимальная длина 280 символов!' })
  @IsString()
  text: string;

  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @Type(() => TweetUserDto)
  user: TweetUserDto;
}
