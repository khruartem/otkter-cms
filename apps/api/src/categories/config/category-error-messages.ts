import type { PrismaErrorMessages } from '../../prisma/types.js';

export const categoryErrorMessages = {
  P2003: 'Указана несуществующая связанная сущность.',
  P2025: 'Категория не найдена!',
} as const satisfies PrismaErrorMessages;
