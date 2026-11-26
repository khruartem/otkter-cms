import { Prisma } from '../../generated/prisma/client.js';

import { categoryImagesInclude } from '../../categories/config/category-images-include.js';
import { personDetailsInclude } from '../../persons/config/person-details-include.js';
import { photoDetailsInclude } from '../../photos/config/photo-details-include.js';

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
  events: {
    orderBy: {
      dateTime: 'asc',
    },
  },
  persons: {
    include: {
      person: {
        include: personDetailsInclude,
      },
    },
  },
  photos: {
    include: photoDetailsInclude,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  },
} as const satisfies Prisma.ProjectInclude;
