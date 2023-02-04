import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: `${path}/uploads`,
    //   serveRoot: '/static',
    // }),
    CloudinaryModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
