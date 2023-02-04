import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFiles(@UploadedFile() file: Express.Multer.File) {
    // const saveArr: MFile[] = [new MFile(file)];
    // if (file.mimetype.includes('image')) {
    //   const buffer = await this.filesService.convertToWebP(file.buffer);
    //   saveArr.push(
    //     new MFile({
    //       originalname: `${file.originalname.split('.')[0]}.webp`,
    //       buffer,
    //     }),
    //   );
    // }
    // return this.filesService.saveFiles(saveArr);

    return await this.cloudinary.upload(file).catch(() => {
      throw new HttpException(
        'Что-то пошло не так....',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }
}
