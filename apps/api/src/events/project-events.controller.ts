import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { EventsService } from './events.service.js';
import { EventResponseMapper } from './mappers/event-response.mapper.js';

import { CreateEventDto } from './dto/create-event.dto.js';
import { ResponseEventDto } from './dto/response-event.dto.js';

@Controller('projects/:projectId/events')
export class ProjectEventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventResponseMapper: EventResponseMapper,
  ) {}

  @Post()
  async createEvent(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() dto: CreateEventDto,
  ): Promise<ResponseEventDto> {
    const event = await this.eventsService.create(projectId, dto);

    return this.eventResponseMapper.toDto(event);
  }

  @Get()
  async getEvents(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ResponseEventDto[]> {
    const events = await this.eventsService.findAll(projectId);

    return events.map((event) => this.eventResponseMapper.toDto(event));
  }
}
