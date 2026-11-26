import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';

import { PhotosService } from './photos.service.js';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotosService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePhoto(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.photoService.remove(id);
  }
}
