import { Injectable } from '@nestjs/common';
import { StorageService } from '../../storage/storage.service.js';
import { Image } from '../../generated/prisma/client.js';
import { ImageResponseDto } from '../dto/image-response.dto.js';

@Injectable()
export class ImageResponseMapper {
  constructor(private readonly storageService: StorageService) {}

  toDto(image: Image): ImageResponseDto {
    return {
      id: image.id,
      storageKey: image.storageKey,
      mimeType: image.mimeType,
      width: image.width,
      height: image.height,
      size: Number(image.size),
      url: this.storageService.getPublicUrl(image.storageKey),
    };
  }
}
