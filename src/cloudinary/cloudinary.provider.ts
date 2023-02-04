import { CloudinaryConfig } from 'src/configs/cloudinary.config';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: CloudinaryConfig,
};
