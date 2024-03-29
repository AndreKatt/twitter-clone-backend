import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
// local libs
import { FORBIDDEN_USER_EXCRPTION, TWEET_NOT_FOUD } from './tweet.constants';
import { CreateTweetDto } from './dto/createTweet.dto';
import { TweetModel } from './tweet.model';

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

  async findTweetsByEmail(
    email: string,
  ): Promise<DocumentType<TweetModel>[] | null> {
    const tweets = (
      await this.tweetModel.find({}).sort({ createdAt: -1 }).exec()
    ).filter((tweet) => tweet.user.email === email);

    return tweets;
  }

  async create(dto: CreateTweetDto): Promise<DocumentType<TweetModel>> {
    return this.tweetModel.create(dto);
  }

  async update(
    id: string,
    dto: CreateTweetDto,
  ): Promise<DocumentType<TweetModel> | null> {
    return this.tweetModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findLike(id: string, email: string): Promise<boolean> {
    const tweet = await this.tweetModel.findById(id).exec();

    if (tweet) {
      return tweet.likes.includes(email) ? true : false;
    } else {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
  }

  async action(
    id: string,
    type: 'likes' | 'replies',
    item: string,
    unlikeType?: boolean,
  ): Promise<DocumentType<TweetModel> | null> {
    const tweetData = await this.findTweetById(id);

    if (tweetData) {
      if (unlikeType) {
        const updatedLikes = tweetData.likes.filter((email) => email !== item);
        return this.tweetModel
          .findByIdAndUpdate(id, { likes: updatedLikes }, { new: true })
          .exec();
      } else {
        return this.tweetModel
          .findByIdAndUpdate(
            id,
            { [type]: [...tweetData[type], item] },
            { new: true },
          )
          .exec();
      }
    } else {
      throw new NotFoundException(TWEET_NOT_FOUD);
    }
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
