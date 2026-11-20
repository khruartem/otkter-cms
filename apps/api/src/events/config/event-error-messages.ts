import type { PrismaErrorMessages } from '../../prisma/types.js';

export const eventErrorMessages = {
  P2025: 'Событие не найдено!',
} as const satisfies PrismaErrorMessages;
