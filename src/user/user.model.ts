import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface UserModel extends Base {}
export class UserModel extends TimeStamps {
  @prop()
  userId: Types.ObjectId;

  @prop({ unique: true, required: true })
  email: string;

  @prop({ required: true })
  fullname: string;

  @prop({ unique: true, required: true })
  username: string;

  @prop({ default: '' })
  avatarUrl: string;

  @prop({ unique: true, required: true, select: false })
  passwordHash: string;

  @prop({ required: true, select: false })
  confirmHash: string;

  @prop({ default: false })
  confirmed: boolean;

  @prop({ default: [] })
  following: string[];

  @prop({ default: [] })
  followers: string[];

  @prop({ default: [] })
  likes: string[];
}
