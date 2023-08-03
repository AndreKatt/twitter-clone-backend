import { Type } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { TweetUserDto } from './createTweet.dto';

export class ReplyDto {
  @Type(() => TweetUserDto)
  user: TweetUserDto;

  @MinLength(1, { message: 'Введите текст ответа.' })
  @MaxLength(280, { message: 'Максимальная длина 280 символов!' })
  @IsString()
  text: string;
}
