import { Prisma } from '../../generated/prisma/client.js';

export function getConstraintIndex(
  error: Prisma.PrismaClientKnownRequestError,
): string | null {
  if (
    typeof error.meta === 'object' &&
    error.meta !== null &&
    'driverAdapterError' in error.meta &&
    typeof error.meta.driverAdapterError === 'object' &&
    error.meta.driverAdapterError !== null &&
    'cause' in error.meta.driverAdapterError &&
    typeof error.meta.driverAdapterError.cause === 'object' &&
    error.meta.driverAdapterError.cause !== null &&
    'constraint' in error.meta.driverAdapterError.cause &&
    typeof error.meta.driverAdapterError.cause.constraint === 'object' &&
    error.meta.driverAdapterError.cause.constraint !== null &&
    'index' in error.meta.driverAdapterError.cause.constraint &&
    typeof error.meta.driverAdapterError.cause.constraint.index === 'string'
  ) {
    return error.meta.driverAdapterError.cause.constraint.index;
  }
  
  return null;
}
