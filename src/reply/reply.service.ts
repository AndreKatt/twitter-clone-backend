import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
// local libs
import { ReplyModel } from './reply.model';
import { FORBIDDEN_USER_EXCRPTION } from 'src/tweet/tweet.constants';
import { CreateReplyDto } from './dto/createReply.dto';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(ReplyModel) private readonly replyModel: ModelType<ReplyModel>,
    private readonly jwtService: JwtService,
  ) {}

  async index(): Promise<DocumentType<ReplyModel>[]> {
    return this.replyModel.find({}).exec();
  }

  async findReplyById(id: string): Promise<DocumentType<ReplyModel> | null> {
    return await this.replyModel.findById(id).exec();
  }

  async findByPublicationId(
    replies: string[],
  ): Promise<(DocumentType<ReplyModel> | null)[]> {
    return Promise.all(replies.map((id) => this.findReplyById(id)));
  }

  async create(dto: CreateReplyDto): Promise<DocumentType<ReplyModel>> {
    return this.replyModel.create(dto);
  }

  async verify(
    id: string,
    email: string,
    username: string,
  ): Promise<DocumentType<ReplyModel> | null> {
    const reply = await this.findReplyById(id);
    const replyEmail = reply?.user.email;
    const replyUsername = reply?.user.username;

    if (email) {
      if (email !== replyEmail) {
        throw new ForbiddenException(FORBIDDEN_USER_EXCRPTION);
      }
    }
    if (username) {
      if (username !== replyUsername) {
        throw new ForbiddenException(FORBIDDEN_USER_EXCRPTION);
      }
    }
    return reply;
  }

  async delete(id: string) {
    this.replyModel.findByIdAndDelete(id).exec();
  }
}
