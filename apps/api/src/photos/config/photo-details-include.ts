import { Prisma } from '../../generated/prisma/client.js';

export const photoDetailsInclude = {
  image: true,
} as const satisfies Prisma.PhotoInclude;
