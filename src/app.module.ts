import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getMongoConfig } from './configs/mongo.config';
import { TweetModule } from './tweet/tweet.module';
import { MediaModule } from './media/media.module';
import { UserModule } from './user/user.module';
import { FilesModule } from './files/files.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    UserModule,
    TweetModule,
    MediaModule,
    FilesModule,
    CloudinaryModule,
  ],
})
export class AppModule {}
