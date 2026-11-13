import { BadRequestException, NotFoundException } from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client.js';

export function handleCategoryError(error: unknown): never {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  if (error.code === 'P2025') {
    throw new NotFoundException('Категория не найдена!');
  }

  if (error.code === 'P2003') {
    throw new BadRequestException('Указана несуществующая связанная сущность.');
  }

  throw error;
}
