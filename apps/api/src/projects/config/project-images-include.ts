import { Prisma } from '../../generated/prisma/client.js';

export const projectImagesInclude = {
  image: true,
  poster: true,
  preview: true,
  icon: true,
} as const satisfies Prisma.ProjectInclude;
