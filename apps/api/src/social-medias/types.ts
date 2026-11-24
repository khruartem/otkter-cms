import { Prisma } from '../generated/prisma/client.js';

import { socialMediaDetailsInclude } from './config/social-media-details-include.js';

export type SocialMediaDetails = Prisma.SocialMediaGetPayload<{
  include: typeof socialMediaDetailsInclude;
}>;
