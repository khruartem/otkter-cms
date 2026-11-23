import { Injectable } from '@nestjs/common';

import { CategoryResponseMapper } from '../../categories/mappers/category-response.mapper.js';
import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';
import { EventResponseMapper } from '../../events/mappers/event-response.mapper.js';

import { ResponseProjectDto } from '../dto/response-project.dto.js';

import type { ProjectDetails } from '../types.js';

@Injectable()
export class ProjectResponseMapper {
  constructor(
    private readonly imageResponseMapper: ImageResponseMapper,
    private readonly categoryResponseMapper: CategoryResponseMapper,
    private readonly eventResponseMapper: EventResponseMapper,
  ) {}

  toDto(project: ProjectDetails): ResponseProjectDto {
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
      categories,
      events,
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
      categories: categories.map(({ category }) =>
        this.categoryResponseMapper.toDto(category),
      ),
      events: events.map((event) => this.eventResponseMapper.toDto(event)),
      categoryIsAttention,
      createdAt,
      updatedAt,
      publicationStatus,
    };
  }
}
