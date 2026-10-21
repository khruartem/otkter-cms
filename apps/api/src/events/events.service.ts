import { Injectable } from '@nestjs/common';

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
}
