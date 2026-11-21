import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';

import { ProjectEventsController } from './project-events.controller.js';
import { EventsController } from './events.controller.js';

import { EventsService } from './events.service.js';
import { EventResponseMapper } from './mappers/event-response.mapper.js';

@Module({
  controllers: [ProjectEventsController, EventsController],
  providers: [EventsService, EventResponseMapper],
  imports: [PrismaModule],
  exports: [EventResponseMapper],
})
export class EventsModule {}
