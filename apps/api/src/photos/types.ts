import { Prisma } from '../generated/prisma/client.js';

import { photoDetailsInclude } from './config/photo-details-include.js';

export type PhotoDetails = Prisma.PhotoGetPayload<{
  include: typeof photoDetailsInclude;
}>;
