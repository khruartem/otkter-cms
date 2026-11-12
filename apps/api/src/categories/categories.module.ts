import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { ImagesModule } from '../images/images.module.js';

import { CategoriesController } from './categories.controller.js';

import { CategoriesService } from './categories.service.js';
import { CategoryResponseMapper } from './mappers/category-response.mapper.js';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryResponseMapper],
  imports: [PrismaModule, ImagesModule],
})
export class CategoriesModule {}
