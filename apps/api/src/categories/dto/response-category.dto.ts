import { ResponseImageDto } from '../../images/dto/response-image.dto.js';

export class ResponseCategoryDto {
  id: string;
  icon: ResponseImageDto | null;
  text: string;
}
