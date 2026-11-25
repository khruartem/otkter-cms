import type { PrismaErrorMessages } from '../../prisma/types.js';

export const photoErrorMessages = {
  P2002: 'Фото с таким порядковым номером уже существует!',
} as const satisfies PrismaErrorMessages;
