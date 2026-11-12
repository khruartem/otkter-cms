import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
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

  @Get()
  async getCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoriesService.findAll();

    return categories.map((category) =>
      this.categoryResponseMapper.toDto(category),
    );
  }

  @Get(':id')
  async getCategory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.findOne(id);

    return this.categoryResponseMapper.toDto(category);
  }
}
