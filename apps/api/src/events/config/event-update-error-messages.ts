import type { PrismaErrorMessages } from '../../prisma/types.js';

export const eventUpdateErrorMessages = {
  P2025: 'Событие не найдено!',
} as const satisfies PrismaErrorMessages;
