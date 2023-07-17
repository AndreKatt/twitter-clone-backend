import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from '../user/strategies/jwt.strategy';
import { getJWTConfig } from '../configs/jwt.config';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { TweetModel } from './tweet.model';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { UserModel } from 'src/user/user.model';

@Module({
  controllers: [TweetController],
  imports: [
    TypegooseModule.forFeature([
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
  providers: [TweetService, JwtStrategy],
})
export class TweetModule {}
