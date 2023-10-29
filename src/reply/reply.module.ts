import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
// local libs
import { JwtStrategy } from '../user/strategies/jwt.strategy';
import { getJWTConfig } from '../configs/jwt.config';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { ReplyModel } from './reply.model';
import { TweetModel } from 'src/tweet/tweet.model';
import { TweetService } from 'src/tweet/tweet.service';

@Module({
  controllers: [ReplyController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ReplyModel,
        schemaOptions: {
          collection: 'Reply',
        },
      },
      {
        typegooseClass: TweetModel,
        schemaOptions: {
          collection: 'Tweet',
        },
      },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    PassportModule,
  ],
  providers: [ReplyService, JwtStrategy, TweetService],
})
export class ReplyModule {}
