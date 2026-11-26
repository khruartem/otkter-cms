import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { PhotosService } from './photos.service.js';
import { PhotoResponseMapper } from './mapper/photo-response.mapper.js';

import { CreatePhotoDto } from './dto/create-photo.dto.js';
import type { ResponsePhotoDto } from './dto/response-photo.dto.js';

@Controller('persons/:id/photos')
export class PersonPhotosController {
  constructor(
    private readonly photoService: PhotosService,
    private readonly photoResponseMapper: PhotoResponseMapper,
  ) {}

  @Post()
  async createPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreatePhotoDto,
  ): Promise<ResponsePhotoDto> {
    const photo = await this.photoService.createForPerson(id, dto);

    return this.photoResponseMapper.toDto(photo);
  }
}
