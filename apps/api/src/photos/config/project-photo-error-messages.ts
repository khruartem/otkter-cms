import { PrismaErrorMessages } from '../../prisma/types.js';

import type { photoErrorMessages } from './photo-error-messages.js';

export const projectPhotoErrorMessages = {
  ...photoErrorMessages,
  P2025: 'Проект или изображение не найдены!',
} as const satisfies PrismaErrorMessages;
