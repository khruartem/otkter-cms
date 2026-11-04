import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IMAGE_CONFIG } from './config/image.config.js';

type File = Express.Multer.File;

@Controller('images')
export class ImagesController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: IMAGE_CONFIG.maxFileSize,
            message: `Файл слишком большой! Максимальный размер — ${IMAGE_CONFIG.maxFileSize / (2 * 1024)} МБ.`,
          }),
          new FileTypeValidator({
            fileType: IMAGE_CONFIG.allowedMimeTypes,
            errorMessage:
              'Недопустимый формат файла! Разрешены только JPG, PNG и WEBP.',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: File,
  ): Pick<File, 'originalname' | 'size' | 'mimetype'> {
    const { originalname, size, mimetype } = file;

    return { originalname, size, mimetype };
  }
}
