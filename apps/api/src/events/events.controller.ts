import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { EventsService } from './events.service.js';
import type { Event } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  getEvents(): Event[] {
    return this.eventsService.getEvents();
  }

  @Get(':id')
  getEvent(@Param('id', ParseIntPipe) id: number): Event {
    const event = this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException('Мероприятие не найдено!');
    }

    return event;
  }

  @Post()
  createEvent(@Body() body: CreateEventDto): Event {
    return this.eventsService.createEvent(body);
  }
}
