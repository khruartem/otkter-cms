import { Image } from '../../generated/prisma/client.js';
import { ImageResponseDto } from '../dto/image-response.dto.js';

export function toImageResponseDto(image: Image): ImageResponseDto {
  return {
    id: image.id,
    storageKey: image.storageKey,
    mimeType: image.mimeType,
    width: image.width,
    height: image.height,
    size: Number(image.size),
  };
}
