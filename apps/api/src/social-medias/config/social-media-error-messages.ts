import type { PrismaErrorMessages } from '../../prisma/types.js';

export const socialMediaErrorMessages = {
  P2002: 'У персоны уже есть социальная сеть с таким порядковым номером.',
  P2003: 'Указана несуществующая персона или иконка.',
  P2025: 'Социальная сеть не найдена!',
} as const satisfies PrismaErrorMessages;
