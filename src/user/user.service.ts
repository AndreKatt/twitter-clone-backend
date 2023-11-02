import { InjectModel } from 'nestjs-typegoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import {
  HttpException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { CreateUserDto } from './dto/createUser.dto';
import { generateMD5 } from '../utils/generateHash';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserModel } from './user.model';
import { sendEmail } from './sendMail';
import {
  WRONG_PASSWORD,
  USER_UNAUTHORIZED,
  PASSWORDS_ARE_NOT_EQUAL,
  UNCONFIRMED_PROFILE,
  USER_NOT_FOUND,
} from './user.constants';
import { CurrentUserDto } from './dto/currentUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async index(): Promise<DocumentType<UserModel>[]> {
    return this.userModel.find({}).exec();
  }

  async create(dto: CreateUserDto): Promise<DocumentType<UserModel>> {
    if (dto.password !== dto.password2) {
      throw new BadRequestException(PASSWORDS_ARE_NOT_EQUAL);
    } else {
      const confirmHash = generateMD5(Math.random().toString());
      const salt = await genSalt(10);
      const newUser = new this.userModel({
        email: dto.email,
        username: dto.username,
        fullname: dto.fullname,
        passwordHash: await hash(dto.password, salt),
        confirmHash: confirmHash,
      });
      sendEmail({
        emailFrom: 'admin@twitter.com',
        emailTo: dto.email,
        subject: 'Подтверждение почты Twitter Clone',
        html: `Для того чтобы подтвердить почту, перейдите <a href="http://localhost:${process.env.PROXY}/api/user/verify?hash=${confirmHash}">по этой ссылке</a>`,
      });
      return newUser.save();
    }
  }

  async findUserByEmail(
    email: string,
  ): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async verifyUserByHash(
    hash: string,
  ): Promise<DocumentType<UserModel> | null> {
    this.userModel.updateOne({ confirmHash: hash }, { confirmed: true }).exec();
    return this.userModel.findOne({ confirmHash: hash }).exec();
  }

  async loginUser(dto: LoginUserDto): Promise<DocumentType<UserModel> | null> {
    const { email, username, password } = dto;
    const user = await this.userModel
      .findOne({ $or: [{ email: email }, { username: username }] })
      .select('+passwordHash')
      .exec();
    if (!user) {
      throw new UnauthorizedException(USER_UNAUTHORIZED);
    }
    if (!user.confirmed) {
      throw new UnauthorizedException(UNCONFIRMED_PROFILE);
    }
    const correctPassword = await compare(password, user.passwordHash);
    if (!correctPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return this.userModel.findOne(
      { email: user.email } || { username: username },
    );
  }

  async loginWithJWT(email: string, username: string, fullname: string) {
    const tokenData = { email, username, fullname };
    return {
      access_token: await this.jwtService.signAsync(tokenData),
    };
  }

  async getCurrentUser(
    email: string,
    username: string,
    fullname: string,
  ): Promise<CurrentUserDto> {
    return { email: email, username: username, fullname: fullname };
  }

  async findFollowing(id: string, email: string): Promise<boolean> {
    const currentUser = await this.findUserByEmail(email);
    const followedUser = await this.userModel.findById(id).exec();

    if (followedUser && currentUser) {
      return currentUser.following.includes(followedUser.email) ? true : false;
    } else {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async updateUserData(
    id: Types.ObjectId | string,
    type: 'following' | 'followers' | 'likes' | 'avatarUrl' | 'profileImageUrl',
    data: string[] | string,
  ) {
    return this.userModel
      .findByIdAndUpdate(id, { [type]: data }, { new: true })
      .exec();
  }

  async changeSubscriptions(
    id: string,
    type: 'subscribe' | 'unsubscribe',
    email: string,
  ): Promise<DocumentType<UserModel> | null> {
    const currentUser = await this.findUserByEmail(email);
    const followingUser = await this.userModel.findById(id).exec();

    if (currentUser && followingUser) {
      const updatedFollowing =
        type === 'subscribe'
          ? [...currentUser.following, followingUser.email]
          : currentUser.following.filter((acc) => acc !== followingUser.email);

      const updatedFollowers =
        type === 'subscribe'
          ? [...followingUser.followers, currentUser.email]
          : followingUser.followers.filter((acc) => acc !== email);

      this.updateUserData(followingUser._id, 'followers', updatedFollowers);

      return this.updateUserData(
        currentUser._id,
        'following',
        updatedFollowing,
      );
    } else {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async changeLikes(
    tweetId: string,
    type: 'like' | 'unlike',
    email: string,
  ): Promise<DocumentType<UserModel> | null> {
    const user = await this.findUserByEmail(email);

    if (user) {
      const updatedLikes =
        type === 'like'
          ? [...user.likes, tweetId]
          : user.likes.filter((id) => id !== tweetId);

      return this.updateUserData(user.id, 'likes', updatedLikes);
    } else {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async delete(id: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
