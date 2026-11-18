import { Prisma } from '../generated/prisma/client.js';

import { projectDetailsInclude } from './config/project-details-include.js';

export type ProjectDetails = Prisma.ProjectGetPayload<{
  include: typeof projectDetailsInclude;
}>;
