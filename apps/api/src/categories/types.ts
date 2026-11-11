import { Prisma } from '../generated/prisma/client.js';
import { categoryImagesInclude } from './config/category-images-include.js';

export type CategoryWithImage = Prisma.CategoryGetPayload<{
  include: typeof categoryImagesInclude;
}>;
