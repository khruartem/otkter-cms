import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

import { CategoryWithImage } from './types.js';

import { categoryImagesInclude } from './config/category-images-include.js';
import { handlePrismaError } from '../prisma/utils/handle-prisma-error.js';
import { categoryErrorMessages } from './config/category-error-messages.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateCategoryDto): Promise<CategoryWithImage> {
    try {
      return await this.prismaService.category.create({
        data: {
          ...dto,
        },
        include: categoryImagesInclude,
      });
    } catch (error) {
      handlePrismaError(error, categoryErrorMessages);
    }
  }

  async findAll(): Promise<CategoryWithImage[]> {
    return this.prismaService.category.findMany({
      include: categoryImagesInclude,
    });
  }

  async findOne(id: string): Promise<CategoryWithImage> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: categoryImagesInclude,
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена!');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryWithImage> {
    try {
      return await this.prismaService.category.update({
        where: { id },
        data: { ...dto },
        include: categoryImagesInclude,
      });
    } catch (error) {
      handlePrismaError(error, categoryErrorMessages);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.category.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, categoryErrorMessages);
    }
  }
}
