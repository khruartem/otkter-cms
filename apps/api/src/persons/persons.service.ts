import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { CreatePersonDto } from './dto/create-person.dto.js';

import { personDetailsInclude } from './config/person-details-include.js';
import { personErrorMessages } from './config/person-error-messages.js';

import { handlePrismaError } from '../prisma/utils/handle-prisma-error.js';

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
      handlePrismaError(error, personErrorMessages);
    }
  }
}
