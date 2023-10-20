import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
