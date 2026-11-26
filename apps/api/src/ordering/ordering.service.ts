import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { OrderingAdapter } from './types.js';

@Injectable()
export class OrderingService {
  constructor(private readonly prismaService: PrismaService) {}

  async reorder(ids: string[], adapter: OrderingAdapter): Promise<void> {}
}
