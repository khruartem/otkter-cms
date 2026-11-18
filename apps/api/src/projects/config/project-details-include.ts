import { Prisma } from '../../generated/prisma/client.js';

import { categoryImagesInclude } from '../../categories/config/category-images-include.js';

export const projectDetailsInclude = {
  image: true,
  poster: true,
  preview: true,
  icon: true,
  categories: {
    include: {
      category: {
        include: categoryImagesInclude,
      },
    },
  },
} as const satisfies Prisma.ProjectInclude;
