import type { PrismaErrorMessages } from '../../prisma/types.js';

export const personErrorMessages = {
  P2003: 'Указана несуществующая связанная сущность.',
  P2025: 'Персона не найдена!',
} as const satisfies PrismaErrorMessages;
