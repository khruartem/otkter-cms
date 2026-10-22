import { Injectable } from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto.js';

export interface Event {
  id: number;
  title: string;
}

const EVENTS: Event[] = [
  {
    id: 1,
    title: 'Спектакль «Есенин. Жизнь в стихах»',
  },
  {
    id: 2,
    title: 'Творческая встреча',
  },
];

@Injectable()
export class EventsService {
  getEvents(): Event[] {
    return EVENTS;
  }

  getEvent(id: number): Event | undefined {
    return EVENTS.find((event) => event.id === id);
  }

  createEvent(event: CreateEventDto): Event {
    const nextId =
      EVENTS.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;

    const nextEvent = { ...event, id: nextId };

    EVENTS.push(nextEvent);

    return nextEvent;
  }
}
