import { Injectable } from '@nestjs/common';
import type { Event } from '../../generated/prisma/client.js';
import { ResponseEventDto } from '../dto/response-event.dto.js';

@Injectable()
export class EventResponseMapper {
  toDto(event: Event): ResponseEventDto {
    const { id, place, dateTime, label } = event;

    return {
      id,
      place,
      dateTime,
      label,
    };
  }
}
