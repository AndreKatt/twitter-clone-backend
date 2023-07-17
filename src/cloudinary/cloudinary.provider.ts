import { CloudinaryConfig } from 'src/configs/cloudinary.config';
import { CLOUDINARY } from './constants';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: CloudinaryConfig,
};
