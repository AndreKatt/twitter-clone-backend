import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

import { JwtService } from '@nestjs/jwt/dist/jwt.service';

import { FORBIDDEN_USER_EXCRPTION } from './tweet.constants';
import { CreateTweetDto } from './dto/createTweet.dto';
import { TweetModel } from './tweet.model';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(TweetModel) private readonly tweetModel: ModelType<TweetModel>,
    private readonly jwtService: JwtService,
  ) {}

  async index(): Promise<DocumentType<TweetModel>[]> {
    return this.tweetModel.find({}).exec();
  }

  async findTweetById(id: string): Promise<DocumentType<TweetModel> | null> {
    return this.tweetModel.findById(id).exec();
  }

  async create(dto: CreateTweetDto): Promise<DocumentType<TweetModel>> {
    return this.tweetModel.create(dto);
  }

  async delete(id: string, email: string) {
    const tweet = await this.findTweetById(id);
    const currentEmail = tweet?.user.email;
    if (email !== currentEmail) {
      throw new ForbiddenException(FORBIDDEN_USER_EXCRPTION);
    }
    return this.tweetModel.findByIdAndDelete(id).exec();
  }
}
