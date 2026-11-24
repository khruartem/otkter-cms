import type { PrismaErrorMessages } from '../../prisma/types.js';

export const personCategoryErrorMessages = {
  P2002: 'Категория уже привязана к персоне.',
  P2003: 'Указана несуществующая персона или категория.',
  P2025: 'Категория не привязана к персоне.',
} as const satisfies PrismaErrorMessages;
