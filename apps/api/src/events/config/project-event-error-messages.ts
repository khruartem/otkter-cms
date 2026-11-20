import type { PrismaErrorMessages } from '../../prisma/types.js';

export const projectEventErrorMessages = {
  P2025: 'Проект не найден!',
} as const satisfies PrismaErrorMessages;
