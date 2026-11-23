import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreatePersonDto } from './dto/create-person.dto.js';

import { personDetailsInclude } from './config/person-details-include.js';

import { handlePersonError } from './utils/handle-person-error.js';

import type { PersonDetails } from './types.js';

@Injectable()
export class PersonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreatePersonDto): Promise<PersonDetails> {
    try {
      return await this.prismaService.person.create({
        data: {
          ...dto,
        },
        include: personDetailsInclude,
      });
    } catch (error) {
      handlePersonError(error);
    }
  }

  async findAll(): Promise<PersonDetails[]> {
    return this.prismaService.person.findMany({
      include: personDetailsInclude,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });
  }

  async findOne(id: string): Promise<PersonDetails> {
    const person = await this.prismaService.person.findUnique({
      where: { id },
      include: personDetailsInclude,
    });

    if (!person) {
      throw new NotFoundException('Персона не найдена!');
    }

    return person;
  }
}
