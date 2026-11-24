import type { PrismaErrorMessages } from '../../prisma/types.js';

export const projectPersonErrorMessages = {
  P2003: 'Указан несуществующий проект или персона.',
  P2025: 'Персона не привязана к проекту.',
} as const satisfies PrismaErrorMessages;
