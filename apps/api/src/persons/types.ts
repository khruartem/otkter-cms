import { Prisma } from '../generated/prisma/client.js';
import { personDetailsInclude } from './config/person-details-include.js';

export type PersonDetails = Prisma.PersonGetPayload<{
  include: typeof personDetailsInclude;
}>;
