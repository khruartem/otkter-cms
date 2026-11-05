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

import { ImagesService } from './images.service.js';

import { IMAGE_CONFIG } from './config/image.config.js';

import type { File } from './types.js';
import { ImageResponseDto } from './dto/image-response.dto.js';
import { toImageResponseDto } from './utils/to-image-response-dto.js';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: IMAGE_CONFIG.maxFileSize,
            message: `Файл слишком большой! Максимальный размер — ${IMAGE_CONFIG.maxFileSize / IMAGE_CONFIG.maxFileSize / (1024 * 1024)} МБ.`,
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
  ): Promise<ImageResponseDto> {
    return toImageResponseDto(await this.imagesService.upload(file));
  }
}
