import type { ResponseImageDto } from '../../images/dto/response-image.dto.js';

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
  createdAt: Date;
  updatedAt: Date;
  publicationStatus: PublicationStatus;
}
