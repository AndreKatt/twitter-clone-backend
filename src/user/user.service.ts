import { InjectModel } from 'nestjs-typegoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';

import { sendEmail } from './sendMail';
import { UserModel } from './user.model';
import { CreateUserDto } from './dto/createUser.dto';
import { generateMD5 } from '../utils/generateHash';
import { LoginUserDto } from './dto/loginUser.dto';
import {
  WRONG_PASSWORD,
  USER_UNAUTHORIZED,
  PASSWORDS_ARE_NOT_EQUAL,
} from './user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async index(): Promise<DocumentType<UserModel>[]> {
    return this.userModel.find({}).exec();
  }

  async create(dto: CreateUserDto): Promise<DocumentType<UserModel>> {
    if (dto.password !== dto.password2) {
      throw new BadRequestException(PASSWORDS_ARE_NOT_EQUAL);
    } else {
      const confirmHash = generateMD5(Math.random().toString());
      sendEmail({
        emailFrom: 'admin@twitter.com',
        emailTo: dto.email,
        subject: 'Подтверждение почты Twitter Clone',
        html: `Для того чтобы подтвердить почту, перейдите <a href="http://localhost:${process.env.PORT}/api/user/verify?hash=${confirmHash}">по этой ссылке</a>`,
      });

      return this.userModel.create({ ...dto, confirmHash });
    }
  }

  async findUserById(userId: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findById(userId).exec();
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
      .exec();
    if (!user) {
      throw new BadRequestException(USER_UNAUTHORIZED);
    } else {
      const pass: any = [];
      await this.userModel
        .findOne({ email: email })
        .select('+password')
        .then((params) => {
          pass.push(params?.password);
        });
      if (password !== pass[0]) {
        throw new BadRequestException(WRONG_PASSWORD);
      } else {
        return this.userModel.findOne({ email: email });
      }
    }
  }

  async delete(id: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
