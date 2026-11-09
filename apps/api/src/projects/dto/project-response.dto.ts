import { PublicationStatus } from '../../generated/prisma/client.js';
import { ImageResponseDto } from '../../images/dto/image-response.dto.js';

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
  isMain: boolean;
  isActive: boolean;
  categoryIsAttention: boolean;
  createdAt: Date;
  updatedAt: Date;
  publicationStatus: PublicationStatus;
}
