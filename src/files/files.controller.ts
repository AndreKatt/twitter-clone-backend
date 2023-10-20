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
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { FilesService } from './files.service';
import { client } from 'src/configs/uploadcare.config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFiles(@UploadedFile() file: Express.Multer.File): Promise<void> {
    const buffer = await this.filesService.convertToWebP(file.buffer);

    client
      .uploadFile(buffer)
      .then((file) => console.log(file.uuid))
      .catch((e) => {
        throw new HttpException(
          `Что-то пошло не так.... ${e}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
  }
}
