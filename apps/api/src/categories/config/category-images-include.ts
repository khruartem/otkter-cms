import { Prisma } from '../../generated/prisma/client.js';

export const categoryImagesInclude = {
  icon: true,
} as const satisfies Prisma.CategoryInclude;
