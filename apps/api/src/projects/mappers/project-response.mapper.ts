import { Injectable } from '@nestjs/common';
import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';
import { ProjectResponseDto } from '../dto/project-response.dto.js';
import { ProjectWithImages } from '../types.js';

@Injectable()
export class ProjectResponseMapper {
  constructor(private readonly imageResponseMapper: ImageResponseMapper) {}

  toDto(project: ProjectWithImages): ProjectResponseDto {
    const {
      id,
      slug,
      title,
      shortDescription,
      description,
      sortOrder,
      image,
      poster,
      preview,
      icon,
      isMain,
      isActive,
      categoryIsAttention,
      createdAt,
      updatedAt,
      publicationStatus,
    } = project;

    return {
      id,
      slug,
      title,
      shortDescription,
      description,
      sortOrder,
      image: image ? this.imageResponseMapper.toDto(image) : null,
      poster: poster ? this.imageResponseMapper.toDto(poster) : null,
      preview: preview ? this.imageResponseMapper.toDto(preview) : null,
      icon: icon ? this.imageResponseMapper.toDto(icon) : null,
      isMain,
      isActive,
      categoryIsAttention,
      createdAt,
      updatedAt,
      publicationStatus,
    };
  }
}
