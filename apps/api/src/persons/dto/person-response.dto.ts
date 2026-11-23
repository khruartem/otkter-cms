import type { ImageResponseDto } from '../../images/dto/image-response.dto.js';

import type { PublicationStatus } from '../../generated/prisma/client.js';

export class PersonResponseDto {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  sortOrder: number | null;
  image: ImageResponseDto | null;
  poster: ImageResponseDto | null;
  preview: ImageResponseDto | null;
  icon: ImageResponseDto | null;
  createdAt: Date;
  updatedAt: Date;
  publicationStatus: PublicationStatus;
}
