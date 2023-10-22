import {
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/user/guards/jwt.guard';
import { FilesService } from './files.service';
import { client } from 'src/configs/uploadcare.config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    const buffer = await this.filesService.convertToWebP(
      files.map((file) => file.buffer),
    );

    const result = client
      .uploadFileGroup(buffer)
      .then((data) => data.files.map((file) => file.uuid))
      .catch((e) => {
        throw new HttpException(
          `Что-то пошло не так.... ${e}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    return result;
  }
}
