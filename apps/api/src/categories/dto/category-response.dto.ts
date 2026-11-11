import { ImageResponseDto } from '../../images/dto/image-response.dto.js';

export class CategoryResponseDto {
  id: string;
  icon: ImageResponseDto | null;
  text: string;
}
