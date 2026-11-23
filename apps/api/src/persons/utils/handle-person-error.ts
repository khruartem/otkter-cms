import { ConflictException } from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client.js';

import { getConstraintIndex } from '../../prisma/utils/get-constraint-index.js';
import { handlePrismaError } from '../../prisma/utils/handle-prisma-error.js';

import { personErrorMessages } from '../config/person-error-messages.js';

export function handlePersonError(error: unknown): never {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  if (error.code === 'P2002') {
    const index = getConstraintIndex(error);

    if (index === 'person_slug_key') {
      throw new ConflictException('Персона с таким slug уже существует');
    }

    if (index === 'person_sort_order_key') {
      throw new ConflictException(
        'Персона с таким порядковым номером уже существует',
      );
    }

    throw new ConflictException('Нарушена уникальность данных персоны.');
  }

  handlePrismaError(error, personErrorMessages);
}
