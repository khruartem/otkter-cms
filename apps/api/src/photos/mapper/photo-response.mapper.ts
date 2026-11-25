import { Injectable } from '@nestjs/common';

import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';

import type { PhotoDetails } from '../types.js';
import type { ResponsePhotoDto } from '../dto/response-photo.dto.js';

@Injectable()
export class PhotoResponseMapper {
  constructor(private readonly imageResponseMapper: ImageResponseMapper) {}

  toDto(photo: PhotoDetails): ResponsePhotoDto {
    const { id, image, sortOrder } = photo;

    return {
      id,
      sortOrder,
      image: this.imageResponseMapper.toDto(image),
    };
  }
}
