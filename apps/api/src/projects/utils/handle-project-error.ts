import { ConflictException, NotFoundException } from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client.js';

import { getConstraintIndex } from '../../prisma/utils/get-constraint-index.js';

export function handleProjectError(error: unknown): never {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  if (error.code === 'P2002') {
    const index = getConstraintIndex(error);

    if (index === 'project_slug_key') {
      throw new ConflictException('Проект с таким slug уже существует');
    }

    if (index === 'project_sort_order_key') {
      throw new ConflictException(
        'Проект с таким порядковым номером уже существует',
      );
    }

    throw new ConflictException('Нарушена уникальность данных проекта');
  }

  if (error.code === 'P2025') {
    throw new NotFoundException('Проект не найден!');
  }

  throw error;
}
