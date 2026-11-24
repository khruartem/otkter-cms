import { ResponseImageDto } from '../../images/dto/response-image.dto.js';

export class ResponseSocialMediaDto {
  id: string;
  icon: ResponseImageDto | null;
  sortOrder: number | null;
  url: string;
  text: string;
}
