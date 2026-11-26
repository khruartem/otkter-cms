import { Module } from '@nestjs/common';

import { OrderingService } from './ordering.service.js';

import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  providers: [OrderingService],
  imports: [PrismaModule],
  exports: [OrderingService],
})
export class OrderingModule {}
