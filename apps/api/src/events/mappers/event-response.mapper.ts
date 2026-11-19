import { Injectable } from '@nestjs/common';
import type { Event } from '../../generated/prisma/client.js';
import { EventResponseDto } from '../dto/event-response.dto.js';

@Injectable()
export class EventResponseMapper {
  toDto(event: Event): EventResponseDto {
    const { id, place, dateTime, label } = event;

    return {
      id,
      place,
      dateTime,
      label,
    };
  }
}
