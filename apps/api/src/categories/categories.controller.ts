import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CategoryResponseMapper } from './mappers/category-response.mapper.js';
import { CategoryResponseDto } from './dto/category-response.dto.js';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly categoryResponseMapper: CategoryResponseMapper,
  ) {}

  @Post()
  async createCategory(
    @Body() dto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.create(dto);

    return this.categoryResponseMapper.toDto(category);
  }
}
