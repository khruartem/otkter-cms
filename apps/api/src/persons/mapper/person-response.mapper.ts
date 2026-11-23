import { Injectable } from '@nestjs/common';

import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';

import type { PersonDetails } from '../types.js';
import type { PersonResponseDto } from '../dto/person-response.dto.js';

@Injectable()
export class PersonResponseMapper {
  constructor(private readonly imageResponseMapper: ImageResponseMapper) {}

  toDto(person: PersonDetails): PersonResponseDto {
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
      createdAt,
      updatedAt,
      publicationStatus,
    } = person;

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
      createdAt,
      updatedAt,
      publicationStatus,
    };
  }
}
