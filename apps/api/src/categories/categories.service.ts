import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { categoryImagesInclude } from './config/category-images-include.js';
import { CategoryWithImage } from './types.js';
import { Prisma } from '../generated/prisma/client.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { handleCategoryError } from './utils/handle-category-error.js';

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
      handleCategoryError(error);
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
      handleCategoryError(error);
    }
  }
}
