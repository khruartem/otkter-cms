import { Injectable } from '@nestjs/common';

import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';
import { CategoryResponseMapper } from '../../categories/mappers/category-response.mapper.js';

import type { PersonDetails } from '../types.js';
import type { ResponsePersonDto } from '../dto/response-person.dto.js';

@Injectable()
export class PersonResponseMapper {
  constructor(
    private readonly imageResponseMapper: ImageResponseMapper,
    private readonly categoryResponseMapper: CategoryResponseMapper,
  ) {}

  toDto(person: PersonDetails): ResponsePersonDto {
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
      categories,
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
      categories: categories.map(({ category }) =>
        this.categoryResponseMapper.toDto(category),
      ),
      createdAt,
      updatedAt,
      publicationStatus,
    };
  }
}
