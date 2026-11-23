import type { ResponseCategoryDto } from '../../categories/dto/response-category.dto.js';
import type { ResponseEventDto } from '../../events/dto/response-event.dto.js';
import type { ResponseImageDto } from '../../images/dto/response-image.dto.js';

import type { PublicationStatus } from '../../generated/prisma/client.js';

export class ResponseProjectDto {
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
  events: ResponseEventDto[];
  isMain: boolean;
  isActive: boolean;
  categoryIsAttention: boolean;
  createdAt: Date;
  updatedAt: Date;
  publicationStatus: PublicationStatus;
}
