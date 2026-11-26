import type { PrismaErrorMessages } from '../../prisma/types.js';

import { photoErrorMessages } from './photo-error-messages.js';

export const personPhotoErrorMessages = {
  ...photoErrorMessages,
  P2025: 'Персона или изображение не найдены!',
} as const satisfies PrismaErrorMessages;
