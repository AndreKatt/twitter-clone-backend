import { InjectModel } from 'nestjs-typegoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/createUser.dto';
import { generateMD5 } from '../utils/generateHash';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserModel } from './user.model';
import { sendEmail } from './sendMail';
import {
  WRONG_PASSWORD,
  USER_UNAUTHORIZED,
  PASSWORDS_ARE_NOT_EQUAL,
} from './user.constants';

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
        html: `Для того чтобы подтвердить почту, перейдите <a href="http://localhost:${process.env.PORT}/api/user/verify?hash=${confirmHash}">по этой ссылке</a>`,
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
    const correctPassword = await compare(password, user.passwordHash);
    if (!correctPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return this.userModel.findOne(
      { email: user.email } || { username: username },
    );
  }

  async loginWithJWT(dto: LoginUserDto) {
    return {
      access_token: await this.jwtService.signAsync(dto),
    };
  }

  async delete(id: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
