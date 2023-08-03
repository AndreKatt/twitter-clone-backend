import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class TweetUser {
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  username: string;

  @prop({ required: true })
  fullname: string;
}

class Reply {
  @prop({ required: true })
  user: TweetUser;

  @prop({ required: true })
  text: string;
}

export interface TweetModel extends Base {}
export class TweetModel extends TimeStamps {
  @prop()
  tweetId: Types.ObjectId;

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
  replies: Reply[];
}
