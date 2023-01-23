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

  @prop({ unique: true, required: true, select: false })
  password: string;

  @prop({ required: true, select: false })
  password2: string;

  @prop({ required: true, select: false })
  confirmHash: string;

  @prop({ default: false })
  confirmed: boolean;

  // @prop()
  // location: string;

  // @prop()
  // about: string;

  // @prop()
  // website: string;
}
