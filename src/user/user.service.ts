import { Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';

import { CreateUserDto } from './dto/createUser.dto';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
  ) {}

  async index(): Promise<DocumentType<UserModel>[]> {
    return this.userModel.find({}).exec();
  }

  async create(dto: CreateUserDto): Promise<DocumentType<UserModel>> {
    return this.userModel.create(dto);
  }

  async findUserById(userId: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findById(userId).exec();
  }

  async delete(id: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
