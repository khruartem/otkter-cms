import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

import { projectEventErrorMessages } from './config/project-event-error-messages.js';
import { eventErrorMessages } from './config/event-error-messages.js';

import { handlePrismaError } from '../prisma/utils/handle-prisma-error.js';

import type { Event } from '../generated/prisma/client.js';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(projectId: string, dto: CreateEventDto): Promise<Event> {
    try {
      return await this.prismaService.event.create({
        data: {
          ...dto,
          dateTime: new Date(dto.dateTime),
          project: {
            connect: { id: projectId },
          },
        },
      });
    } catch (error) {
      handlePrismaError(error, projectEventErrorMessages);
    }
  }

  async findAll(projectId: string): Promise<Event[]> {
    return this.prismaService.event.findMany({
      where: {
        projectId,
      },
      orderBy: {
        dateTime: 'asc',
      },
    });
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    try {
      return await this.prismaService.event.update({
        where: { id },
        data: {
          ...dto,
          dateTime: dto.dateTime ? new Date(dto.dateTime) : undefined,
        },
      });
    } catch (error) {
      handlePrismaError(error, eventErrorMessages);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prismaService.event.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error, eventErrorMessages);
    }
  }
}
