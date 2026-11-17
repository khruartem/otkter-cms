import type { PrismaErrorMessages } from '../../prisma/types.js';

export const projectCategoryErrorMessages = {
  P2002: 'Категория уже привязана к проекту.',
  P2003: 'Указан несуществующий проект или категория.',
  P2025: 'Категория не привязана к проекту.',
} as const satisfies PrismaErrorMessages;
