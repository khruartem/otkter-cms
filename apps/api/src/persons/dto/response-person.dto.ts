import type { ResponseImageDto } from '../../images/dto/response-image.dto.js';
import type { ResponseCategoryDto } from '../../categories/dto/response-category.dto.js';
import type { ResponseSocialMediaDto } from '../../social-medias/dto/response-social-media.dto.js';

import type { PublicationStatus } from '../../generated/prisma/client.js';

export class ResponsePersonDto {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  sortOrder: number | null;
  image: ResponseImageDto | null;
  poster: ResponseImageDto | null;
  preview: ResponseImageDto | null;
  icon: ResponseImageDto | null;
  categories: ResponseCategoryDto[];
  socialMedias: ResponseSocialMediaDto[];
  createdAt: Date;
  updatedAt: Date;
  publicationStatus: PublicationStatus;
}
