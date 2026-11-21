import type { CategoryResponseDto } from '../../categories/dto/category-response.dto.js';
import type { EventResponseDto } from '../../events/dto/event-response.dto.js';
import type { ImageResponseDto } from '../../images/dto/image-response.dto.js';

import type { PublicationStatus } from '../../generated/prisma/client.js';

export class ProjectResponseDto {
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
  categories: CategoryResponseDto[];
  events: EventResponseDto[];
  isMain: boolean;
  isActive: boolean;
  categoryIsAttention: boolean;
  createdAt: Date;
  updatedAt: Date;
  publicationStatus: PublicationStatus;
}
