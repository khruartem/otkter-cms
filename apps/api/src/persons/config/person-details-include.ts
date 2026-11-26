import { Prisma } from '../../generated/prisma/client.js';

import { categoryImagesInclude } from '../../categories/config/category-images-include.js';
import { socialMediaDetailsInclude } from '../../social-medias/config/social-media-details-include.js';
import { photoDetailsInclude } from '../../photos/config/photo-details-include.js';

export const personDetailsInclude = {
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
  socialMedias: {
    include: socialMediaDetailsInclude,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  },
  photos: {
    include: photoDetailsInclude,
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  },
} as const satisfies Prisma.PersonInclude;
