import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
// local libs
import { TweetModel, TweetUser } from 'src/tweet/tweet.model';

export interface ReplyModel extends Base {}
export class ReplyModel extends TimeStamps {
  @prop()
  replyId: Types.ObjectId;

  @prop({ required: true })
  text: string;

  @prop()
  images: string[];

  @prop({ required: true })
  user: TweetUser;

  @prop({ default: [] })
  likes: string[];

  @prop({ default: [] })
  retweets: string[];

  @prop({ default: [] })
  replies: string[];
}
