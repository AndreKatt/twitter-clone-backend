import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';
import { TweetUserDto } from 'src/tweet/dto/createTweet.dto';

export class CreateReplyDto {
  @Type(() => Types.ObjectId)
  replyId: string;

  @MinLength(1, { message: 'Введите текст ответа.' })
  @MaxLength(280, { message: 'Максимальная длина 280 символов!' })
  @IsString()
  text: string;

  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @Type(() => TweetUserDto)
  user: TweetUserDto;
}
