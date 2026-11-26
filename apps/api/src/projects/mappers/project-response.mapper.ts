import { Injectable } from '@nestjs/common';

import { CategoryResponseMapper } from '../../categories/mappers/category-response.mapper.js';
import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';
import { EventResponseMapper } from '../../events/mappers/event-response.mapper.js';
import { PersonResponseMapper } from '../../persons/mapper/person-response.mapper.js';
import { PhotoResponseMapper } from '../../photos/mapper/photo-response.mapper.js';

import { ResponseProjectDto } from '../dto/response-project.dto.js';

import type { ProjectDetails } from '../types.js';

@Injectable()
export class ProjectResponseMapper {
  constructor(
    private readonly imageResponseMapper: ImageResponseMapper,
    private readonly categoryResponseMapper: CategoryResponseMapper,
    private readonly eventResponseMapper: EventResponseMapper,
    private readonly personResponseMapper: PersonResponseMapper,
    private readonly photoResponseMapper: PhotoResponseMapper,
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
      categoryIsAttention,
      events,
      persons,
      photos,
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
      categoryIsAttention,
      events: events.map((event) => this.eventResponseMapper.toDto(event)),
      persons: persons.map(({ id, role, extra, person }) => ({
        id,
        role,
        extra,
        person: this.personResponseMapper.toDto(person),
      })),
      photos: photos.map((photo) => this.photoResponseMapper.toDto(photo)),
      createdAt,
      updatedAt,
      publicationStatus,
    };
  }
}
