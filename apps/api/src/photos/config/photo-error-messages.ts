import type { PrismaErrorMessages } from '../../prisma/types.js';

export const photoErrorMessages = {
  P2002: 'Фото с таким порядковым номером уже существует!',
  P2025: 'Фото не найдено!',
} as const satisfies PrismaErrorMessages;
