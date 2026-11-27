import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import type { OrderingAdapter } from './types.js';
import { areIdsEqual } from './utils/areIdsEqual.js';

@Injectable()
export class OrderingService {
  constructor(private readonly prismaService: PrismaService) {}

  async reorder(ids: string[], adapter: OrderingAdapter): Promise<void> {
    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException('В массиве есть повторяющиеся элементы.');
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.$queryRaw`
        SELECT pg_advisory_xact_lock(hashtextextended(${adapter.lockKey}::text, 0::bigint))
      `;
      const ordered = await adapter.findOrdered(tx);

      if (!areIdsEqual(ids, ordered)) {
        throw new BadRequestException(
          'Текущий набор упорядоченных UUID не совпадает с переданным массивом.',
        );
      }

      if (ids.length === 0) return;

      await adapter.clearOrdered(tx);

      for (let i = 0; i < ids.length; i++) {
        await adapter.setOrder(tx, ids[i], i + 1);
      }
    });
  }
}
