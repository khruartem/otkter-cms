import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client.js';

import { PrismaErrorMessages } from '../types.js';

export function handlePrismaError(
  error: unknown,
  messages: PrismaErrorMessages,
): never {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw error;
  }

  if (error.code === 'P2002' && messages.P2002 !== undefined) {
    throw new ConflictException(messages[error.code]);
  }

  if (error.code === 'P2003' && messages.P2003 !== undefined) {
    throw new BadRequestException(messages[error.code]);
  }

  if (error.code === 'P2025' && messages.P2025 !== undefined) {
    throw new NotFoundException(messages[error.code]);
  }

  throw error;
}
