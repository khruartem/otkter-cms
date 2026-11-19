import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { EventsService } from './events.service.js';

import { CreateEventDto } from './dto/create-event.dto.js';
import { EventResponseDto } from './dto/event-response.dto.js';
import { EventResponseMapper } from './mappers/event-response.mapper.js';

@Controller('projects/:projectId/events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventResponseMapper: EventResponseMapper,
  ) {}

  @Post()
  async createEvent(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateEventDto,
  ): Promise<EventResponseDto> {
    const event = await this.eventsService.create(projectId, dto);

    return this.eventResponseMapper.toDto(event);
  }
}
