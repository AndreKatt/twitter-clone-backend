import { BadRequestException, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { CreateUserDto } from './dto/createUser.dto';
import { UserModel } from './user.model';
import { sendEmail } from './sendMail';
import { generateMD5 } from '../utils/generateHash';
import { PASSWORDS_ARE_NOT_EQUAL } from './user.constants';

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
        subject: 'Подтверждение почты TwitterClone',
        html: `Для того чтобы подтвердить почту, перейдите <a href="http://localhost:${process.env.PORT}/signup/verify?hash=${confirmHash}">по этой ссылке</a>`,
      });

      return this.userModel.create({ ...dto, confirmHash });
    }
  }

  async findUserById(userId: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findById(userId).exec();
  }

  async delete(id: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
