import { ImageResponseDto } from '../dto/image-response.dto.js';
import { ImageWithUrl } from '../types.js';

export function toImageResponseDto(image: ImageWithUrl): ImageResponseDto {
  return {
    id: image.id,
    storageKey: image.storageKey,
    mimeType: image.mimeType,
    width: image.width,
    height: image.height,
    size: Number(image.size),
    url: image.url,
  };
}
