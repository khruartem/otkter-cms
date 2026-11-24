import { Prisma } from '../../generated/prisma/client.js';

export const socialMediaDetailsInclude = {
  icon: true,
} as const satisfies Prisma.SocialMediaInclude;
