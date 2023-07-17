import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

import { JwtService } from '@nestjs/jwt/dist/jwt.service';

import { FORBIDDEN_USER_EXCRPTION } from './tweet.constants';
import { CreateTweetDto } from './dto/createTweet.dto';
import { TweetModel } from './tweet.model';
import { UpdateWriteOpResult } from 'mongoose';
import { UserModel } from 'src/user/user.model';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(TweetModel) private readonly tweetModel: ModelType<TweetModel>,
    private readonly jwtService: JwtService,
  ) {}

  async index(): Promise<DocumentType<TweetModel>[]> {
    return this.tweetModel.find({}).sort({ createdAt: -1 }).exec();
  }

  async findTweetById(id: string): Promise<DocumentType<TweetModel> | null> {
    return this.tweetModel.findById(id).exec();
  }

  async findTweetByEmail(
    email: string,
  ): Promise<DocumentType<TweetModel>[] | null> {
    const tweets = (await this.tweetModel.find({}).exec()).filter(
      (tweet) => tweet.user.email === email,
    );

    return tweets;
  }

  async create(dto: CreateTweetDto): Promise<DocumentType<TweetModel>> {
    return this.tweetModel.create(dto);
  }

  async update(id: string, dto: CreateTweetDto) {
    return this.tweetModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async verify(
    id: string,
    email: string,
    username: string,
  ): Promise<DocumentType<TweetModel> | null> {
    const tweet = await this.findTweetById(id);
    const tweetEmail = tweet?.user.email;
    const tweetUsername = tweet?.user.username;
    if (email) {
      if (email !== tweetEmail) {
        throw new ForbiddenException(FORBIDDEN_USER_EXCRPTION);
      }
    }
    if (username) {
      if (username !== tweetUsername) {
        throw new ForbiddenException(FORBIDDEN_USER_EXCRPTION);
      }
    }
    return tweet;
  }

  async delete(id: string) {
    this.tweetModel.findByIdAndDelete(id).exec();
  }
}
