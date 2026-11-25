import { ResponseImageDto } from '../../images/dto/response-image.dto.js';

export class ResponsePhotoDto {
  id: string;
  sortOrder: number | null;
  image: ResponseImageDto;
}
