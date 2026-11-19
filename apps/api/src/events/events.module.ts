import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';

import { EventsController } from './events.controller.js';

import { EventsService } from './events.service.js';
import { EventResponseMapper } from './mappers/event-response.mapper.js';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventResponseMapper],
  imports: [PrismaModule],
})
export class EventsModule {}
