import { Prisma } from '../generated/prisma/client.js';

export interface OrderingAdapter {
  findOrdered(tx: Prisma.TransactionClient): Promise<{ id: string }[]>;
  clearOrdered(tx: Prisma.TransactionClient): Promise<void>;
  setOrder(
    tx: Prisma.TransactionClient,
    id: string,
    sortOrder: number,
  ): Promise<void>;
}
