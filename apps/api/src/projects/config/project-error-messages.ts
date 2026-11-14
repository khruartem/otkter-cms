import type { PrismaErrorMessages } from '../../prisma/types.js';

export const projectErrorMessages = {
  P2002: 'Нарушена уникальность данных проекта.',
  P2003: 'Указана несуществующая связанная сущность.',
  P2025: 'Проект не найден!',
} as const satisfies PrismaErrorMessages;
