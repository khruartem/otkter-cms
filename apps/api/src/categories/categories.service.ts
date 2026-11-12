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
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Указана несуществующая связанная сущность.',
        );
      }

      throw error;
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
}
