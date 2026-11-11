import { Injectable } from '@nestjs/common';
import { ImageResponseMapper } from '../../images/mappers/image-response.mapper.js';
import { CategoryWithImage } from '../types.js';
import { CategoryResponseDto } from '../dto/category-response.dto.js';

@Injectable()
export class CategoryResponseMapper {
  constructor(private readonly imageResponseMapper: ImageResponseMapper) {}

  toDto(category: CategoryWithImage): CategoryResponseDto {
    const { id, text, icon } = category;

    return {
      id,
      text,
      icon: icon ? this.imageResponseMapper.toDto(icon) : null,
    };
  }
}
