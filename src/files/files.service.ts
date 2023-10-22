import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  convertToWebP(files: Buffer[]): Promise<Buffer[]> {
    return Promise.all(files.map((file) => sharp(file).webp().toBuffer()));
  }
}
