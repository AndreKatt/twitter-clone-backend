import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { TweetModule } from './tweet/tweet.module';
import { MediaModule } from './media/media.module';
import { getMongoConfig } from './configs/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UserModule,
    TweetModule,
    MediaModule,
  ],
})
export class AppModule {}