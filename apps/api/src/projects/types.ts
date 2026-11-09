import { Prisma } from '../generated/prisma/client.js';

export type ProjectWithImages = Prisma.ProjectGetPayload<{
  include: {
    image: true;
    poster: true;
    preview: true;
    icon: true;
  };
}>;
