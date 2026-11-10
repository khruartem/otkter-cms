import { Prisma } from '../generated/prisma/client.js';

import { projectImagesInclude } from './config/project-images-include.js';

export type ProjectWithImages = Prisma.ProjectGetPayload<{
  include: typeof projectImagesInclude;
}>;
